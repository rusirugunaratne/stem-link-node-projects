import type { Request, Response } from "express";
import { SubmissionService } from "../service/submission.service.js";
import type { CreateSubmissionInput, GetSubmissionsQueryInput } from "../models/submission.schema.js";
import { catchAsync } from "../utils/catchAsync.js";

const submissionService = new SubmissionService();

export class SubmissionController {
    create = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const body = req.validated.body as CreateSubmissionInput;
        const authenticatedUserId = req.user!.id;

        const newPost = await submissionService.createSubmission(authenticatedUserId, body);
        res.status(201).json({ success: true, data: newPost });
    })

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
}