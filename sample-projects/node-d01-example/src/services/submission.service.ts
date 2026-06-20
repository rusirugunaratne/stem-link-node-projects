import { SubmissionRepository } from "../repository/submission.repository.js";
import { UserRepository } from "../repository/user.repository.js"; // 1. Import UserRepository
import { NotFoundError, ForbiddenError } from "../errors/appError.js";
import type { Submission } from "../generated/prisma/client.js";
import type {
  CreateSubmissionInput,
  GetSubmissionsQueryInput
} from "../models/submission.schema.js";
import { logger } from "../config/logger.js"; // Import your step 1 logger

const submissionRepo = new SubmissionRepository();
const userRepo = new UserRepository(); // 2. Instantiate UserRepository

export class SubmissionService{
  async getAllSubmissions(filters: GetSubmissionsQueryInput) {
    return await submissionRepo.getAll(filters);
  }

  async getSubmissionById(id: number): Promise<Submission> {
    const submission = await submissionRepo.getById(id);
    if (!submission) {
      throw new NotFoundError(`Submission with ID ${id} not found.`);
    }
    return submission;
  }

  // 3. Refactor submission creation to weave in our gamification policy
  async createSubmission(userId: number, data: CreateSubmissionInput): Promise<Submission> {
    // Execute creation and karma update atomically within a single database transaction
    const submission = await submissionRepo.createWithKarma(userId, data, 2);

    logger.info(`✨ Karma points updated (+2) for user ID: ${userId} due to new submission (Transaction Successful)`);

    return submission;
  }

  async updateSubmission(id: number, userId: number, data: CreateSubmissionInput): Promise<Submission> {
    const submission = await this.getSubmissionById(id);

    if (submission.userId !== userId) {
      throw new ForbiddenError("Forbidden: You do not own this submission.");
    }

    return await submissionRepo.update(id, data);
  }

  async deleteSubmission(id: number, userId: number): Promise<void> {
    const submission = await this.getSubmissionById(id);

    if (submission.userId !== userId) {
      throw new ForbiddenError("Forbidden: You do not own this submission.");
    }

    await submissionRepo.delete(id);
  }
}
