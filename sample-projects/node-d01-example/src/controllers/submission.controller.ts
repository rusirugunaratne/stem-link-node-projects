import type { Request, Response } from "express";
import { SubmissionService } from "../services/submission.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import type { 
  CreateSubmissionInput, 
  GetSubmissionsQueryInput 
} from "../models/submission.schema.js";

const submissionService = new SubmissionService();

export class SubmissionController {
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filters = req.validated.query as GetSubmissionsQueryInput;
    const { submissions, totalItems } = await submissionService.getAllSubmissions(filters);
    const totalPages = Math.ceil(totalItems / filters.limit);

    res.json({
      success: true,
      data: submissions,
      meta: { 
        totalItems, 
        currentPage: filters.page, 
        totalPages, 
        itemsPerPage: filters.limit 
      },
    });
  });

  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const newPost = await submissionService.createSubmission(authenticatedUserId, body);
    res.status(201).json({ success: true, data: newPost });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const updatedPost = await submissionService.updateSubmission(id, authenticatedUserId, body);
    res.json({ success: true, data: updatedPost });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const authenticatedUserId = req.user!.id;

    await submissionService.deleteSubmission(id, authenticatedUserId);
    res.json({ success: true, message: "Submission successfully removed." });
  });
}
