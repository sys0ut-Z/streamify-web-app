import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err instanceof AppError && err.isOperational){
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }
  
  return res.status(500).json({
    message: "Internal server error, Something went wrong",
    stack: err.stack || {}
  })
}