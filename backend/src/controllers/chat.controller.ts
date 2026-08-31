import { NextFunction, Request, Response } from "express";
import { generateStreamToken } from "../service/stream.service";

export const getStreamToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth?.userId as string;
    const streamToken = generateStreamToken(userId);

    return res.status(200).json(streamToken);
  } catch (error) {
    next(error);  
  }
};