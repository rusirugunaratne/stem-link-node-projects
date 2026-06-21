import type { CreateSubmissionInput, GetSubmissionsQueryInput } from "../models/submission.schema.js";
import { SubmissionRepository } from "../repository/submission.repository.js";

const submissionRepository = new SubmissionRepository();

export class SubmissionService {
    async createSubmission(userId: number, data: CreateSubmissionInput) {
        return await submissionRepository.create(userId, data);
    }

    async getAllSubmissions(filters: GetSubmissionsQueryInput) {
        // Business logic for pagination metadata can live here or in the controller
        return await submissionRepository.getAll(filters);
    }
}