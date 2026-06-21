import { prisma } from "../config/prisma.js";
import type { CreateSubmissionInput, GetSubmissionsQueryInput } from "../models/submission.schema.js";

export class SubmissionRepository {
    async create(userId: number, data: CreateSubmissionInput) {
        return await prisma.submission.create({
            data: { userId, ...data }
        });
    }

    async getAll(filters: GetSubmissionsQueryInput) {
        const { page, limit, sortBy, sortOrder, search, userId } = filters;
        const skip = (page - 1) * limit;

        // Dynamically build conditions
        const whereClause: any = {};

        if (userId) {
            whereClause.userId = userId;
        }

        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        // Execute transaction to pull items and total record volume simultaneously
        const [submissions, totalItems] = await prisma.$transaction([
            prisma.submission.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: {
                        select: { id: true, firstName: true, lastName: true, email: true },
                    },
                },
            }),
            prisma.submission.count({ where: whereClause }),
        ]);

        return { submissions, totalItems };
    }
}