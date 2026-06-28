import { rateLimit } from "express-rate-limit";
import { logger } from "../config/logger.js";

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again in 15 minutes"
    },
    handler: (req, res, next, options) => {
        logger.warn("Global rate limit tripped by ip: " + req.ip + " on route " + req.originalUrl);
        res.status(options.statusCode).json(options.message);
    }
});

export const sensitiveActionRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Slow down! You are performing actions too quickly, please wait a minute"
    },
    handler: (req, res, next, options) => {
        logger.warn("Sensitive action rate limit tripped by ip: " + req.ip + " on route " + req.originalUrl);
        res.status(options.statusCode).json(options.message);
    }
});