import type { NextFunction, Request, Response } from "express"
import { AppError } from "../errors/appError.js"

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        console.error("Found app error: ", err.message);
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        })
        return;
    }

    console.error("An unhandled error has been caught", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}