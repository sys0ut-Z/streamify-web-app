import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const chatRouter = Router();

chatRouter.use(requireAuth);
chatRouter.get("/stream-token", chatController.getStreamToken);

export default chatRouter;