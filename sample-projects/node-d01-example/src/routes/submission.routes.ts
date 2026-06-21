import { Router } from "express";
import { SubmissionController } from "../controller/submission.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSubmissionSchema, getSubmissionsQuerySchema } from "../models/submission.schema.js";

const submissionRouter = Router();
const controller = new SubmissionController();

submissionRouter.post("/", requireAuth, validate(createSubmissionSchema), controller.create);
submissionRouter.get("/", validate(getSubmissionsQuerySchema), controller.getAll);
// put, delete -> remember: only the user who created the submission can do edits to that submission

export default submissionRouter;