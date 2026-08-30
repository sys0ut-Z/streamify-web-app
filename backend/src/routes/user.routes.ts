import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const userRouter = Router();

/**
 * @description Requires authentication for every user route.
 * @access Private
 */
userRouter.use(requireAuth);

/**
 * @description Returns suggested users who are not already friends.
 * @route GET /api/users/recommended
 * @access Private
 */
userRouter.get("/recommended", userController.getRecommendedUsers);
/**
 * @description Returns the authenticated user's friends.
 * @route GET /api/users/friends
 * @access Private
 */
userRouter.get("/friends", userController.getFriends);

/**
 * @description Sends a friend request to the specified user.
 * @route POST /api/users/friend-request/:id
 * @access Private
 */
userRouter.post("/friend-request/:id", userController.sendFriendRequest);
/**
 * @description Accepts the specified friend request.
 * @route PUT /api/users/friend-request/accept/:id
 * @access Private
 */
userRouter.put("/friend-request/accept/:id", userController.acceptFriendRequest);
/**
 * @description Rejects the specified friend request.
 * @route PUT /api/users/friend-request/reject/:id
 * @access Private
 */
userRouter.put("/friend-request/reject/:id", userController.rejectFriendRequest);

/**
 * @description Returns incoming and accepted friend requests.
 * @route GET /api/users/friend-requests
 * @access Private
 */
userRouter.get("/friend-requests", userController.getFriendRequests);
/**
 * @description Returns the user's pending sent requests.
 * @route GET /api/users/outgoing-friend-requests
 * @access Private
 */
userRouter.get("/outgoing-friend-requests", userController.getOutgoingFriendRequests);

export default userRouter;
