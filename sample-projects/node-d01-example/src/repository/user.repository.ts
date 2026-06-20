import { prisma } from "../config/prisma.js";
import type { User } from "../generated/prisma/client.js";

export class UserRepository{
  async findByClerkId(clerkId: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { clerkId } });
  }

  async createUser(data: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    return await prisma.user.create({ data });
  }

  // New method to atomatically increase a user's karma points securely
  async incrementKarma(userId: number, points: number): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        karmaPoints: {
          increment: points, // Atomic operation executed directly by PostgreSQL
        },
      },
    });
  }
}
