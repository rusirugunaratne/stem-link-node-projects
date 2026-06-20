import { Router } from "express";
import { StorageController } from "../controller/storage.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../config/storage.js";
import { sensitiveActionRateLimiter } from "../middlewares/rateLimiter.middleware.js"; // Import sensitive limiter

const storageRouter = Router();
const storageController = new StorageController();

// Prevent script-based file flood damage by bottlenecking upload requests
storageRouter.post(
  "/upload",
  requireAuth,
  sensitiveActionRateLimiter, // Added protection
  upload.single("file"),
  storageController.uploadFile
);

export default storageRouter;
