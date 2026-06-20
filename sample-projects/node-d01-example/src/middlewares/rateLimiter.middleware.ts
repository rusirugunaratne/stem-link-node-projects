import { rateLimit } from "express-rate-limit";
import { logger } from "../config/logger.js";

// 1. Global Limiter: Applied across the entire API surface
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window frame
  max: 100, // Limit each IP to 100 requests per window frame
  standardHeaders: true, // Return standard rate limit info headers (RateLimit-Limit, etc.)
  legacyHeaders: false, // Disable older X-RateLimit headers
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`⚠️ Global Rate Limit Tripped by IP: ${req.ip} on route: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  },
});

// 2. Strict Limiter: Applied to heavy, expensive write operations (file uploads, creating submissions)
export const sensitiveActionRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window frame
  max: 5, // Limit each IP to 5 intensive requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Slow down! You are performing actions too quickly. Please wait a minute.",
  },
  handler: (req, res, next, options) => {
    logger.error(`🚨 High-Velocity Rate Limit Tripped by IP: ${req.ip} on route: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  },
});
