import type { Request, Response } from "express";
import { CommentService } from "../service/comment.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const commentService = new CommentService();

export class CommentController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { message } = req.validated.body;
    const submissionId = req.validated.params.submissionId;
    const userId = req.user!.id;

    const comment = await commentService.createComment(userId, submissionId, message);
    res.status(201).json({ success: true, data: comment });
  });

  getBySubmissionId = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const submissionId = req.validated.params.submissionId;

    const comments = await commentService.getCommentsBySubmissionId(submissionId);
    res.json({ success: true, data: comments });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const userId = req.user!.id;

    await commentService.deleteComment(id, userId);
    res.json({ success: true, message: "Comment deleted successfully" });
  });
}
