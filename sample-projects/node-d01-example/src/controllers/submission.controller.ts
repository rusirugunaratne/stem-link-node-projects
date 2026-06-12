import type { Request, Response } from "express";
import { SubmissionRepository } from "../repository/submission.repository.js";
import { NotFoundError, ForbiddenError } from "../errors/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import type { CreateSubmissionInput, GetSubmissionsQueryInput } from "../models/submission.schema.js";

const submissionRepo = new SubmissionRepository();

export class SubmissionController {

  getAll = catchAsync(async (req: Request, res: Response) => {
    const filters = req.validated.query as GetSubmissionsQueryInput;
    const { submissions, totalItems } = await submissionRepo.getAll(filters);
    const totalPages = Math.ceil(totalItems / filters.limit);

    res.json({
      success: true,
      data: submissions,
      meta: { totalItems, currentPage: filters.page, totalPages, itemsPerPage: filters.limit },
    });
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const newPost = await submissionRepo.create(authenticatedUserId, body);
    res.status(201).json({ success: true, data: newPost });
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const submission = await submissionRepo.getById(id);
    if (!submission) throw new NotFoundError(`Submission with ID ${id} not found.`);
    if (submission.userId !== authenticatedUserId) throw new ForbiddenError();

    const updatedPost = await submissionRepo.update(id, body);
    res.json({ success: true, data: updatedPost });
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const authenticatedUserId = req.user!.id;

    const submission = await submissionRepo.getById(id);
    if (!submission) throw new NotFoundError(`Submission with ID ${id} not found.`);
    if (submission.userId !== authenticatedUserId) throw new ForbiddenError();

    await submissionRepo.delete(id);
    res.json({ success: true, message: "Submission successfully removed." });
  });
}
