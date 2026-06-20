import express from "express";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import globalRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Parsers
app.use(express.json());

// Auth Initialization
app.use(clerkMiddleware());

// API Mounting
app.use("/api", globalRouter);

// Fallback for 404 Route handling
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized Error Handler (CRITICAL: This must be mounted last!)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 StackOverflow Clone Server running perfectly on http://localhost:${PORT}`);
});
