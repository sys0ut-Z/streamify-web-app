import { CookieOptions, Response } from "express";
import { createSession } from "./session.service";
import { createAccessToken } from "./token.service";

const accessCookieOptions: CookieOptions = {
  httpOnly: true, // prevent XSS attacks
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // prevent CSRF
  maxAge: 10 * 60 * 1000 // 10 mins
};

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/auth"
}

export const createAuthSession = async (
  userId: string,
  res: Response
) => {
  // receiver session id & refresh token
  const session = await createSession(userId);

  const accessToken = createAccessToken(
    userId,
    session.sessionId
  );

  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie(
      "refreshToken",
      session.refreshToken,
      refreshCookieOptions
    );

  return session;
}

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
};

export const clearAuthCookies = (
  res: Response
) => {
  res
    .clearCookie("accessToken", accessCookieOptions)
    .clearCookie("refreshToken", refreshCookieOptions);
};