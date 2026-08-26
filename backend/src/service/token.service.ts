import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface AccessTokenPayload{
  sub: string;
  sid: string;
  jti: string;
  type: "access";
}

export function createAccessToken(
  userId: string,
  sessionId: string
){
  const jti = crypto.randomUUID();

  return jwt.sign(
    {
      sub: userId,
      sid: sessionId,
      jti,
      type: "access"
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "10m",
      issuer: "my-api",
      audience: "my-client"
    }
  );
}