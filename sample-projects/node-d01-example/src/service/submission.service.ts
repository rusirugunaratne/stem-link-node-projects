import { logger } from "../config/logger.js";
import type { CreateSubmissionInput, GetSubmissionsQueryInput } from "../models/submission.schema.js";
import { SubmissionRepository } from "../repository/submission.repository.js";

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
}