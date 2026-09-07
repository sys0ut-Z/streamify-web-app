import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";

const authRouter = Router();

/**
 * @description Creates a user account and starts an authenticated session.
 * @route POST /api/auth/signup
 * @access Public
 */
authRouter.post("/signup", authController.signup);

/**
 * @description Authenticates a user and starts a fresh session.
 * @route POST /api/auth/login
 * @access Public
 */
authRouter.post("/login", authController.login);

/**
 * @description Ends the current session and clears authentication cookies.
 * @route POST /api/auth/logout
 * @access Public
 */
authRouter.post("/logout", authController.logout);

/**
 * @description Rotates the refresh token and issues updated authentication cookies.
 * @route POST /api/auth/refresh
 * @access Public
 */
authRouter.post("/refresh", authController.refresh);

/**
 * @description Completes the user's onboarding profile.
 * @route POST /api/auth/onboarding
 * @access Optional
 */
authRouter.post("/onboard", optionalAuth, authController.onboard);

/**
 * @description Returns the authenticated user
 * @route GET /api/auth/me
 * @access Private
 */
authRouter.get("/me", optionalAuth, authController.checkAuth);

export default authRouter;
