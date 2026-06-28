import { prisma } from "../config/prisma.js";
import type { User } from "../generated/prisma/client.js";
import type { UpdateUserInput } from "../models/user.schema.js";

export class UserRepository {
  async findByClerkId(clerkId: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { clerkId } });
  }

  async findById(id: number): Promise<any | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        interestedTags: true,
      },
    });
  }

  async createUser(data: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    return await prisma.user.create({ data });
  }

  async updateUser(userId: number, data: UpdateUserInput): Promise<any> {
    const { interestedTagIds, ...rest } = data;
    const updateData: any = { ...rest };

    if (interestedTagIds !== undefined) {
      updateData.interestedTags = {
        set: interestedTagIds.map((id) => ({ id })),
      };
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        interestedTags: true,
      },
    });
  }
}
