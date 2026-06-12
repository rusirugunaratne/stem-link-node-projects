import type { Request, Response } from "express";
import { SubmissionRepository } from "../repository/submission.repository.js";
import type { CreateSubmissionInput, GetSubmissionsQueryInput } from "../models/submission.schema.js";

const submissionRepo = new SubmissionRepository();

export class SubmissionController {

  // Public Endpoint: No Auth required
  getAll = async (req: Request, res: Response): Promise<void> => {
    const filters = req.validated.query as GetSubmissionsQueryInput;
    const { submissions, totalItems } = await submissionRepo.getAll(filters);

    const totalPages = Math.ceil(totalItems / filters.limit);

    res.json({
      success: true,
      data: submissions,
      meta: { totalItems, currentPage: filters.page, totalPages, itemsPerPage: filters.limit },
    });
  };

  // Protected Endpoint: Authenticated user only
  create = async (req: Request, res: Response): Promise<void> => {
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id; // Guaranteed by requireAuth middleware

    const newPost = await submissionRepo.create(authenticatedUserId, body);
    res.status(201).json({ success: true, data: newPost });
  };

  // Protected Endpoint: Must be Owner
  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const submission = await submissionRepo.getById(id);
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" });
      return;
    }

    if (submission.userId !== authenticatedUserId) {
      res.status(403).json({ success: false, message: "Forbidden: You do not own this submission" });
      return;
    }

    const updatedPost = await submissionRepo.update(id, body);
    res.json({ success: true, data: updatedPost });
  };

  // Protected Endpoint: Must be Owner
  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const authenticatedUserId = req.user!.id;

    const submission = await submissionRepo.getById(id);
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" });
      return;
    }

    if (submission.userId !== authenticatedUserId) {
      res.status(403).json({ success: false, message: "Forbidden: You do not own this submission" });
      return;
    }

    await submissionRepo.delete(id);
    res.json({ success: true, message: "Submission successfully removed" });
  };
}
