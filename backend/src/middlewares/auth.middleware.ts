import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { AccessTokenPayload } from "../service/token.service";
import { redis } from "../lib/redis";

const verifyRequestAccessToken = async (
  req: Request
): Promise<AuthPayload> => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    throw new AppError("Authentication required, please login", 401);
  }
  
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
      {
        issuer: "my-api",
        audience: "my-client"
      }
    ) as AccessTokenPayload;
    
    if (decoded.type !== "access") {
      throw new AppError("Invalid access token", 401);
    }
    
    const sessionKey = `session:${decoded.sid}`;
    const session = await redis.hGetAll(sessionKey);
    
    if (Object.keys(session).length === 0) {
      throw new AppError("Session no longer exists, please login", 401);
    }
    
    if (session.revoked === "true") {
      throw new AppError("Session expired, please login", 401);
    }
    
    return {
      userId: decoded.sub,
      sessionId: decoded.sid,
      jti: decoded.jti
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Access token expired", 401);
    }

    throw error;
  }
}

export const requireAuth = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.auth = await verifyRequestAccessToken(req);

    next();
  } catch (error) {
    next(error);
  }
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.auth = await verifyRequestAccessToken(req);

    next();
  } catch (error) {
    // console.error("Authorization error : ", error);
    next();
  }
}