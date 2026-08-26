import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { optionalAuth } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

authRouter.post("/refresh", authController.refresh);

authRouter.post("/onboarding", optionalAuth, authController.onboard);

export default authRouter;