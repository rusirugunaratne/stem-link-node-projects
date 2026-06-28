import { Router } from "express";
import { StorageController } from "../controller/storage.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../config/storage.js";
import { sensitiveActionRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const storageRouter = Router();
const storageController = new StorageController();

// Protect uploading assets behind authenticated tokens
// upload.single('file') intercepts and parses the multipart attribute named 'file'
storageRouter.post(
  "/upload",
  requireAuth,
  sensitiveActionRateLimiter,
  upload.single("file"),
  storageController.uploadFile
);

export default storageRouter;
