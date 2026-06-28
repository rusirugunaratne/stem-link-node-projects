import { prisma } from "../config/prisma.js";
import type { Comment } from "../generated/prisma/client.js";

export class CommentRepository {
  async createWithKarma(userId: number, submissionId: number, message: string, karmaPoints: number): Promise<Comment> {
    return await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          userId,
          submissionId,
          message,
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, nickname: true, profileImageUrl: true }
          }
        }
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          karmaPoints: {
            increment: karmaPoints
          }
        }
      });

      return comment;
    });
  }

  async findBySubmissionId(submissionId: number): Promise<any[]> {
    return await prisma.comment.findMany({
      where: { submissionId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, nickname: true, profileImageUrl: true }
        }
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return await prisma.comment.findUnique({
      where: { id },
    });
  }

  async delete(id: number): Promise<Comment> {
    return await prisma.comment.delete({
      where: { id },
    });
  }
}
