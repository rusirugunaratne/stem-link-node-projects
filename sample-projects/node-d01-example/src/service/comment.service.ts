import { CommentRepository } from "../repository/comment.repository.js";
import { SubmissionRepository } from "../repository/submission.repository.js";
import { NotFoundError, ForbiddenError } from "../errors/appError.js";

const commentRepository = new CommentRepository();
const submissionRepository = new SubmissionRepository();

export class CommentService {
  async createComment(userId: number, submissionId: number, message: string) {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw new NotFoundError("Submission not found");
    }
    return await commentRepository.createWithKarma(userId, submissionId, message, 2);
  }

  async getCommentsBySubmissionId(submissionId: number) {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw new NotFoundError("Submission not found");
    }
    return await commentRepository.findBySubmissionId(submissionId);
  }

  async deleteComment(id: number, userId: number) {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    if (comment.userId !== userId) {
      throw new ForbiddenError("You are not authorized to delete this comment");
    }
    return await commentRepository.delete(id);
  }
}
