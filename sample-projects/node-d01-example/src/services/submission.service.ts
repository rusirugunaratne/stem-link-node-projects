import { SubmissionRepository } from "../repository/submission.repository.js";
import { NotFoundError, ForbiddenError } from "../errors/appError.js";
import type { Submission } from "../generated/prisma/client.js";
import type { 
  CreateSubmissionInput, 
  GetSubmissionsQueryInput 
} from "../models/submission.schema.js";

const submissionRepo = new SubmissionRepository();

export class SubmissionService {
  async getAllSubmissions(filters: GetSubmissionsQueryInput) {
    // Business logic for pagination metadata can live here or in the controller
    return await submissionRepo.getAll(filters);
  }

  async getSubmissionById(id: number): Promise<Submission> {
    const submission = await submissionRepo.getById(id);
    if (!submission) {
      throw new NotFoundError(`Submission with ID ${id} not found.`);
    }
    return submission;
  }

  async createSubmission(userId: number, data: CreateSubmissionInput): Promise<Submission> {
    return await submissionRepo.create(userId, data);
  }

  async updateSubmission(id: number, userId: number, data: CreateSubmissionInput): Promise<Submission> {
    const submission = await this.getSubmissionById(id);

    // Authorization Rule: Only the resource owner can mutate it
    if (submission.userId !== userId) {
      throw new ForbiddenError("Forbidden: You do not own this submission.");
    }

    return await submissionRepo.update(id, data);
  }

  async deleteSubmission(id: number, userId: number): Promise<void> {
    const submission = await this.getSubmissionById(id);

    // Authorization Rule: Only the resource owner can delete it
    if (submission.userId !== userId) {
      throw new ForbiddenError("Forbidden: You do not own this submission.");
    }

    await submissionRepo.delete(id);
  }
}
