import { Router } from "express";
import { SubmissionController } from "../controllers/submission.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSubmissionSchema, getSubmissionsQuerySchema } from "../models/submission.schema.js";
import { sensitiveActionRateLimiter } from "../middlewares/rateLimiter.middleware.js"; // Import sensitive limiter

const router = Router();
const controller = new SubmissionController();

// Public Route (Inherits the 100 requests / 15 mins global limit)
router.get("/", validate(getSubmissionsQuerySchema), controller.getAll);

// Protected & Rate-Limited Writing Route (Enforces max 5 submissions per minute)
router.post(
  "/",
  requireAuth,
  sensitiveActionRateLimiter, // Added protection
  validate(createSubmissionSchema),
  controller.create
);

router.put("/:id", requireAuth, validate(createSubmissionSchema), controller.update);
router.delete("/:id", requireAuth, controller.delete);

export default router;
