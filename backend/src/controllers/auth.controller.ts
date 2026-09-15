import { NextFunction, Request, Response } from "express";
import UserModel, { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import { clearAuthCookies, createAuthSession, setAuthCookies } from "../service/auth.service";
import { revokeSession, rotateRefreshToken } from "../service/session.service";
import { createAccessToken } from "../service/token.service";
import { upsertStreamUser } from "../service/stream.service";
import { LoginRequest, OnboardRequest, SignupRequest } from "../types/auth.types";

/**
 * @description Creates a user account, provisions its Stream profile, and starts an authenticated session.
 * @route POST /api/auth/signup
 * @access Public
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {fullName, email, password} = req.body as SignupRequest;
  try {
    if(!fullName || !email || !password){
      throw new AppError("Please fill all the fields", 400);
    }
    
    if(password.length < 6){
      throw new AppError("Password must be at least 6 characters", 400);
    }
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(email)){
      throw new AppError("Please enter a valid email", 400);
    }
    
    // check for existing user
    const existingUser = await UserModel.findOne({email});
    
    if(existingUser){
      throw new AppError("User account already linked with this email, please login", 400);
    }
    
    // random no from 1 to 100
    const randomNo = Math.floor(Math.random() * 100) + 1;
    const profileAvatar = `https://api.dicebear.com/10.x/adventurer-neutral/png?seed=user-${randomNo}`;
    /* 
    "styles": ["adventurer", "adventurer-neutral", "avataaars", "lorelei", "pixel-art"]
    "img-types" : ["png", "svg", "jpeg"]
    */

    const user = await UserModel.create({
      fullName, 
      email, 
      password,
      profilePic: profileAvatar
    });
    
    // TODO-DONE : create user in stream
    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePic || ""
    })
    
    // create both session and cookies(access token & refresh token)
    await createAuthSession(
      user._id.toString(),
      res
    );
    
    const userData: User = user.toObject();
    const {password: _, ...safeUser} = userData; // ^ take password separately and put the rest of the properties into safeUser
    
    // * const user: User = value;      // TypeScript CHECKS compatibility
    // * const user2 = value as User;   // TypeScript TRUSTS your assertion
    
    res.status(201).json(
      new ApiResponse(safeUser)
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @description Authenticates a user with email and password, then starts a fresh session.
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {email, password} = req.body as LoginRequest;
  try {
    if(!email || !password){
      throw new AppError("Please fill all the fields", 400);
    }

    const user = await UserModel.findOne({email}).select("+password");

    if(!user){
      throw new AppError("User account not linked with this email, please signup", 401);
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if(!isPasswordCorrect){
      throw new AppError("Invalid password, please enter correct password", 401);
    }

    // clear previous tokens from cookies
    clearAuthCookies(res);

    // every new/fresh login gets a fresh session
    // create new session & cookies(access token & refresh token)
    await createAuthSession(
      user._id.toString(),
      res
    );

    // ! Don't send the password back.
    user.password = undefined as never;

    // show successful login message is you want, 
    res.status(200).json(
      new ApiResponse(user)
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @description Revokes the active session and clears authentication cookies.
 * @route POST /api/auth/logout
 * @access Public
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.auth?.sessionId;

    if (sessionId) {
      await revokeSession(sessionId);
    }

    clearAuthCookies(res);

    res.status(200).json(
      new ApiResponse(null, "Logged out successfully")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @description Rotates the refresh token and issues updated authentication cookies.
 * @route POST /api/auth/refresh
 * @access Public
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not found", 401);
    }

    const result = await rotateRefreshToken(refreshToken);

    const accessToken = createAccessToken(result.userId, result.sessionId);

    setAuthCookies(
      res,
      accessToken,
      result.refreshToken
    );

    res.status(200).json(
      new ApiResponse(null, "Token refreshed")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @description Completes the user's onboarding profile and synchronizes it with Stream.
 * @route POST /api/auth/onboarding
 * @access Optional
 */
export const onboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.userId;

    const {fullName, bio, nativeLanguage, learningLanguage, location, profilePic} = req.body as OnboardRequest;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      throw new AppError(
        `
          Please fill all the fields, \n
          Missing fields : ${[
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location"
          ]}
        `
        , 400);
    }

    if(!profilePic){
      throw new AppError("Please select a profile avatar", 400);
    }

    /* 
      ^ you can also send missing fields to client,
      missingFields ; [
        --!fullName && "fullName",
        --!bio && "bio",
        --!nativeLanguage && "nativeLanguage",
        --!learningLanguage && "learningLanguage",
        --!location && "location"
      ].filter(Boolean)
    */

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      {$set: {
        fullName, 
        bio, 
        nativeLanguage, 
        learningLanguage, 
        location, 
        profilePic,
        isOnboarded: true
      }}, 
      {new: true}
    );

    if(!updatedUser){
      throw new AppError("Oops! Something went wrong while onboarding your account, please try again");
    }

    // update user in stream too
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || ""
      });
    } catch (error) {
      throw new AppError("Failed to update user details in stream", 500);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * @description Retrieves the authenticated user's details.
 * @route GET /api/auth/check-auth
 * @access Private
 */
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.userId;
    const user = await UserModel.findById(userId);

    return res.status(200).json(
      new ApiResponse(user)
    );
  } catch (error) {
    next(error);
  }
}
