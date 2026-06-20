import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If it's a known operational error we threw on purpose, use its code and message
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.constructor.name,
      },
    });
    return;
  }

  // Handle unexpected or structural failures gracefully (like DB connection failure or syntax bugs)
  console.error("❌ CRITICAL UNHANDLED SYSTEM ERROR:", err);

  res.status(500).json({
    success: false,
    error: {
      message: "An internal server error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};
