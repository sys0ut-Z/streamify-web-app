import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";

export const getRecommendedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.userId;

    const user = await UserModel.findById(userId);

    const recommendedUsers = await UserModel.aggregate([
      {
        $match: {
          _id: {
            $nin: [
              userId, // exclude current user
              ...(user?.friends ?? []) // exclude current user's friends
            ]
          },
          isOnboarded: true // only onboarded users
        }
      },
      {
        $sample: {
          size: 9
        }
      }
    ]);

    return res.status(200).json(recommendedUsers);
  } catch (error) {
    next(error);
  }
}

export const getFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.auth?.userId)
      .populate({
        path: "friends",
        select: "fullName profilePic nativeLanguage learningLanguage"
      });
    
    const friends = user?.friends ?? [];

    return res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
}