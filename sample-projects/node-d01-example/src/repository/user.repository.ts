import { prisma } from "../config/prisma.js";
import type { User } from "../generated/prisma/client.js";

export class UserRepository {
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
}
