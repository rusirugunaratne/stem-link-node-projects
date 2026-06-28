import type { NextFunction, Request, Response } from "express"
import { AppError } from "../errors/appError.js"
import { logger } from "../config/logger.js";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        logger.error("Found app error: ", err.message);
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        })
        return;
    }

    logger.error("An unhandled error has been caught", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}