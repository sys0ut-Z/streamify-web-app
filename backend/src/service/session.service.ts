import crypto from "crypto";
import { redis } from "../lib/redis";
import { AppError } from "../utils/AppError";
import { ROTATE_REFRESH_TOKEN_SCRIPT } from "./luascript";

export function generateRefreshToken(){
  return crypto.randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string){
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

const REFRESH_TTL = 60 * 60 * 24 * 7;

export async function createSession(userId: string){
  const sessionId = crypto.randomUUID();
  const familyId = crypto.randomUUID();

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const sessionKey = `session:${sessionId}`;
  const refreshKey = `rt:${refreshTokenHash}`;

  // & keep track of all user sessions
  // * if user wants to log out from all devices, this is stored/maintained so that we can log out from all devices
  const userSessionsKey = `user:sessions:${userId}`;

  const now = Date.now();
  const expiry = now + (REFRESH_TTL * 1000);

  await redis.multi()
    .hSet(sessionKey, {
      userId,
      familyId,
      currentRt: refreshTokenHash,
      revoked: "false", // when logout, set to true
      createdAt: now.toString(),
      expiresAt: expiry.toString()
    })
    .expire(sessionKey, REFRESH_TTL)

    .hSet(refreshKey, {
      sessionId,
      familyId,
      status: "active", // or "revoked"
      replacedBy: "" // new token when login
    })
    .expire(refreshKey, REFRESH_TTL)

    // ^ user session key is fixed coz 'userId' is fixed, 
    // ^ later we will fetch all the session ids to kill them
    .sAdd(
      userSessionsKey,
      sessionId
    )
    .exec();

  return {
    sessionId,
    refreshToken
  };
}

export async function revokeSession(
  sessionId: string
) {
  const sessionKey =`session:${sessionId}`;

  const session = await redis.hGetAll(sessionKey);

  if (!session || !session.userId) {
    throw new AppError("Session not found", 404);
  }

  const currentRt = session.currentRt;

  const commands = redis
    .multi()
    .hSet(sessionKey, {
      revoked: "true",
      revokedAt: Date.now().toString()
    });

  if (currentRt) {
    commands.hSet(`rt:${currentRt}`, "status", "revoked");
  }

  await commands.exec();
}

export async function revokeAllSessions(
  userId: string
) {
  const userSessionsKey = `user:sessions:${userId}`;

  // ^ find all session ids of the user
  const sessionIds = await redis.sMembers(userSessionsKey);

  if (sessionIds.length === 0) {
    return;
  }

  const pipeline = redis.multi();

  // ^ mark all the sessions as revoked
  for (const sessionId of sessionIds) {
    pipeline.hSet(
      `session:${sessionId}`,
      {
        revoked: "true",
        revokedAt: Date.now().toString()
      }
    );
  }

  await pipeline.exec();
}

export async function rotateRefreshToken(
  oldRefreshToken: string
) {
  const oldRtHash = hashRefreshToken(oldRefreshToken);
  const oldRtKey = `rt:${oldRtHash}`;
  const oldRt = await redis.hGetAll(oldRtKey);

  if (!oldRt.sessionId) {
    throw new AppError("Invalid refresh token", 401);
  }

  const sessionKey = `session:${oldRt.sessionId}`;
  const session = await redis.hGetAll(sessionKey);

  if (!session || !session.userId) {
    throw new AppError("Session does not exist", 401);
  }

  const expiresAt = Number(session.expiresAt);
  const remainingTtl = Math.floor((expiresAt - Date.now()) / 1000);

  if (remainingTtl <= 0) {
    await revokeSession(oldRt.sessionId);

    throw new AppError("Session expired", 401);
  }

  const newRefreshToken = generateRefreshToken();
  const newRtHash = hashRefreshToken(newRefreshToken);
  const newRtKey = `rt:${newRtHash}`;

  const result = await redis.eval(
    ROTATE_REFRESH_TOKEN_SCRIPT,
    {
      keys: [
        sessionKey,
        oldRtKey,
        newRtKey
      ],
      arguments: [
        newRtHash,
        remainingTtl.toString(),
        oldRtHash
      ]
    }
  ) as [number, string];

  const [success, reason] = result;

  if (!success) {
    if (reason === "REUSE_DETECTED") {
      await revokeSession(oldRt.sessionId);

      throw new AppError("Refresh token reuse detected", 401);
    }

    throw new AppError("Unable to refresh session", 401);
  }

  return {
    userId: session.userId,
    sessionId: oldRt.sessionId,
    refreshToken: newRefreshToken
  };
}
