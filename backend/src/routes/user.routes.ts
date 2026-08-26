import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.get("/recommended", requireAuth, userController.getRecommendedUsers);
userRouter.get("/friends", requireAuth, userController.getFriends);

export default userRouter;