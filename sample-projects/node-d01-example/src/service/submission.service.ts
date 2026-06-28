import { logger } from "../config/logger.js";
import type { CreateSubmissionInput, GetSubmissionsQueryInput, UpdateSubmissionInput } from "../models/submission.schema.js";
import { SubmissionRepository } from "../repository/submission.repository.js";
import { NotFoundError, ForbiddenError } from "../errors/appError.js";

const submissionRepository = new SubmissionRepository();

export class SubmissionService {
    async createSubmission(userId: number, data: CreateSubmissionInput) {
        const submission = await submissionRepository.createWithKarma(userId, data, 2);
        logger.info(`Karma points (+2) added to the user with ID ${userId}`);
        return submission;
    }

    async getAllSubmissions(filters: GetSubmissionsQueryInput) {
        // Business logic for pagination metadata can live here or in the controller
        return await submissionRepository.getAll(filters);
    }

    async getSubmissionById(id: number) {
        const submission = await submissionRepository.findById(id);
        if (!submission) {
            throw new NotFoundError("Submission not found");
        }
        return submission;
    }

    async updateSubmission(id: number, userId: number, data: UpdateSubmissionInput) {
        const submission = await submissionRepository.findById(id);
        if (!submission) {
            throw new NotFoundError("Submission not found");
        }
        if (submission.userId !== userId) {
            throw new ForbiddenError("You are not authorized to alter this submission");
        }
        return await submissionRepository.update(id, data);
    }

    async deleteSubmission(id: number, userId: number) {
        const submission = await submissionRepository.findById(id);
        if (!submission) {
            throw new NotFoundError("Submission not found");
        }
        if (submission.userId !== userId) {
            throw new ForbiddenError("You are not authorized to alter this submission");
        }
        return await submissionRepository.delete(id);
    }
}