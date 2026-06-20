import { Router } from "express";
import { SubmissionController } from "../controllers/submission.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSubmissionSchema, getSubmissionsQuerySchema } from "../models/submission.schema.js";

const router = Router();
const controller = new SubmissionController();

// Public Route
router.get("/", validate(getSubmissionsQuerySchema), controller.getAll);

// Protected Routes
router.post("/", requireAuth, validate(createSubmissionSchema), controller.create);
router.put("/:id", requireAuth, validate(createSubmissionSchema), controller.update);
router.delete("/:id", requireAuth, controller.delete);

export default router;
