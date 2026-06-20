import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import globalRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { logger } from "./config/logger.js";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js"; // Import global limiter

const app = express();
const PORT = process.env.PORT || 3000;

// Mount HTTP logging at the absolute top
app.use(morganMiddleware);

// 1. Mount Global Rate Limiting right under logging to shield the engine immediately
app.use("/api", globalRateLimiter);

// Standard Parsers & Security
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: Origin '${origin}' is blocked.`));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Auth Initialization
app.use(clerkMiddleware());

// API Mounting
app.use("/api", globalRouter);

// Fallback for 404 Route handling
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized Error Handler (CRITICAL: Must be mounted last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 StackOverflow Clone Server running perfectly on http://localhost:${PORT}`);
});
