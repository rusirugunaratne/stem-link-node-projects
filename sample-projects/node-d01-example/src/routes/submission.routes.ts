import { Router } from "express";
import { SubmissionController } from "../controller/submission.controller.js";
import { CommentController } from "../controller/comment.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createSubmissionSchema,
  getSubmissionsQuerySchema,
  submissionIdParamSchema,
  updateSubmissionSchema
} from "../models/submission.schema.js";
import { createCommentSchema, getCommentsSchema } from "../models/comment.schema.js";
import { sensitiveActionRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const submissionRouter = Router();
const controller = new SubmissionController();
const commentController = new CommentController();

submissionRouter.post("/", requireAuth, sensitiveActionRateLimiter, validate(createSubmissionSchema), controller.create);
submissionRouter.get("/", validate(getSubmissionsQuerySchema), controller.getAll);
submissionRouter.get("/:id", validate(submissionIdParamSchema), controller.getById);
submissionRouter.put("/:id", requireAuth, validate(updateSubmissionSchema), controller.update);
submissionRouter.delete("/:id", requireAuth, validate(submissionIdParamSchema), controller.delete);

// Nested comments routes
submissionRouter.post("/:submissionId/comments", requireAuth, validate(createCommentSchema), commentController.create);
submissionRouter.get("/:submissionId/comments", validate(getCommentsSchema), commentController.getBySubmissionId);

export default submissionRouter;