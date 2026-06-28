import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import type { User } from "../generated/prisma/client.js";
import { BadRequestError } from "../errors/appError.js";
import { logger } from "../config/logger.js";
import type { UpdateUserInput } from "../models/user.schema.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const userRepository = new UserRepository();

export class UserService {
  async findOrCreateLocalUser(clerkId: string): Promise<User> {
    // 1. Check database cache
    let localUser = await userRepository.findByClerkId(clerkId);

    // 2. Fallback to Just-In-Time profile sync if missing
    if (!localUser) {
      logger.info(`🔄 Syncing new user from Clerk to Local DB (Clerk ID: ${clerkId})`);
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new BadRequestError("Clerk user profile does not contain an email address");
      }

      const userData: any = {
        clerkId: clerkUser.id,
        email: email,
      };

      if (clerkUser.firstName) userData.firstName = clerkUser.firstName;
      if (clerkUser.lastName) userData.lastName = clerkUser.lastName;

      localUser = await userRepository.createUser(userData);
    }

    return localUser;
  }

  async getUserProfile(userId: number): Promise<any> {
    return await userRepository.findById(userId);
  }

  async updateUserProfile(userId: number, data: UpdateUserInput): Promise<any> {
    return await userRepository.updateUser(userId, data);
  }
}

