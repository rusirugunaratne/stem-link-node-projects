import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";
import { logger } from "../config/logger.js"; // Import logger

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.constructor.name },
    });
    return;
  }

  // Upgrade critical unhandled trace logging to a production log target
  logger.error(`❌ CRITICAL UNHANDLED SYSTEM ERROR: ${err.message}`, { stack: err.stack });

  res.status(500).json({
    success: false,
    error: {
      message: "An internal server error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};
