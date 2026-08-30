import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";
import FriendRequestModel from "../models/friendRequest.model";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import { Types } from "mongoose";

const MAX_FRIEND_REQUESTS = 20;

/**
 * @description Returns onboarded users who are not already friends with the authenticated user.
 * @route GET /api/users/recommended
 * @access Private
 */
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

/**
 * @description Retrieves the authenticated user's friends and their public profile details.
 * @route GET /api/users/friends
 * @access Private
 */
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

/**
 * @description Creates a pending friend request for the user identified by the route parameter.
 * @route POST /api/users/friend-request/:id
 * @access Private
 */
export const sendFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.auth?.userId as string;
    const recipientId = req.params.id as string;

    // if(!receiverId) {
    //   throw new AppError("Something went wrong while sending friend request, pls try again", 400);
    // }

    if(myId === recipientId) {
      throw new AppError("You cannot send friend request to yourself", 400);
    }

    const recipient = await UserModel.findById(recipientId);

    if(!recipient) {
      throw new AppError("User account not found, unable to send friend request", 404);
    }

    // check whether user is already friend of receiver
    if(recipient.friends.includes(new Types.ObjectId(myId))) {
      throw new AppError("You are already friends with this user", 400);
    }
  
    // check whether user has already sent friend request to receiver
    const friendRequest = await FriendRequestModel.findOne({
      $or: [
        {sender: myId, receiver: recipientId},
        {sender: recipientId, receiver: myId}
      ]
    });
    
    if(friendRequest) {
      throw new AppError("A friend request already exists between you and this user", 400);
    }

    // check whether user has exceeded maximum no. of friend requests
    const friendRequests = await FriendRequestModel.find({receiver: myId, status: "pending"});
    if(friendRequests.length >= MAX_FRIEND_REQUESTS) {
      throw new AppError("The user has already exceeded maximum no. of friend requests, pls try again later", 400);
    }

    await FriendRequestModel.create({
      sender: myId,
      receiver: recipientId,
    });

    return res.status(201).json(
      new ApiResponse(null, "Friend request sent")
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @description Accepts a pending friend request and adds both users to each other's friend lists.
 * @route PUT /api/users/friend-request/accept/:id
 * @access Private
 */
export const acceptFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.auth?.userId as string;
    const requestId = req.params.id as string;

    const friendRequest = await FriendRequestModel.findById(requestId);

    if(!friendRequest) {
      throw new AppError("Friend request not found, try sending a new one", 404);
    }

    // recipient should not be the current authenticated user
    if(friendRequest.receiver!.toString() !== myId) {
      throw new AppError("You are not authorized to accept this friend request", 403);
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add user to each other's friend list
    await Promise.all([
      UserModel.findByIdAndUpdate(friendRequest.sender, {$addToSet: {friends: friendRequest.receiver}}),
      UserModel.findByIdAndUpdate(friendRequest.receiver, {$addToSet: {friends: friendRequest.sender}})
    ]);

    return res.status(200).json(
      new ApiResponse(null, "Friend request accepted")
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @description Rejects a friend request and removes the users from each other's friend lists when applicable.
 * @route PUT /api/users/friend-request/reject/:id
 * @access Private
 */
export const rejectFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.auth?.userId as string;
    const requestId = req.params.id as string;

    const friendRequest = await FriendRequestModel.findById(requestId);

    if(!friendRequest) {
      throw new AppError("Friend request not found, try sending a new one", 404);
    }

    // recipient should not be the current authenticated user
    if(friendRequest.receiver!.toString() !== myId) {
      throw new AppError("You are not authorized to accept this friend request", 403);
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    // remove both of them from each other's friend list if they are friends
    await Promise.all([
      UserModel.findByIdAndUpdate(friendRequest.sender, {$pull: {friends: friendRequest.receiver}}),
      UserModel.findByIdAndUpdate(friendRequest.receiver, {$pull: {friends: friendRequest.sender}})
    ]);
  } catch (error) {
    next(error);
  }
}

/**
 * @description Retrieves pending incoming and accepted friend requests for the authenticated user.
 * @route GET /api/users/friend-requests
 * @access Private
 */
export const getFriendRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.auth?.userId as string;

    const incomingRequests = await FriendRequestModel.find({receiver: myId, status: "pending"})
      .populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    // for friends, we will only display name and profile
    const acceptedRequests = await FriendRequestModel.find({receiver: myId, status: "accepted"})
      .populate("sender", "fullName profilePic");

    return res.status(200).json(
      new ApiResponse({incomingRequests, acceptedRequests})
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @description Retrieves pending friend requests sent by the authenticated user.
 * @route GET /api/users/outgoing-friend-requests
 * @access Private
 */
export const getOutgoingFriendRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myId = req.auth?.userId as string;

    const outgoingRequests = await FriendRequestModel.find({sender: myId, status: "pending"})
      .populate("receiver", "fullName profilePic nativeLanguage learningLanguage");

    return res.status(200).json(
      new ApiResponse({outgoingRequests})
    );
  } catch (error) {
    next(error);
  }
}
