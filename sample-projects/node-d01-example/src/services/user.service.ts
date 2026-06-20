import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import { BadRequestError, NotFoundError } from "../errors/appError.js";
import type { User } from "../generated/prisma/client.js";
import type { UpdateProfileInput } from "../models/user.schema.js"; // Import input type
import { logger } from "../config/logger.js";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || "" });
const userRepository = new UserRepository();

export class UserService{
  async findOrCreateLocalUser(clerkId: string): Promise<User> {
    let localUser = await userRepository.findByClerkId(clerkId);

    if (!localUser) {
      logger.info(`🔄 Syncing new user from Clerk to Local DB`, { clerkId });
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new BadRequestError("Clerk user profile does not contain an email address.");
      }

      const userData: any = { clerkId: clerkUser.id, email: email };
      if (clerkUser.firstName) userData.firstName = clerkUser.firstName;
      if (clerkUser.lastName) userData.lastName = clerkUser.lastName;

      localUser = await userRepository.createUser(userData);
    }

    return localUser;
  }

  // New method to process profile configuration business logic
  async updateProfile(userId: number, data: UpdateProfileInput): Promise<User> {
    // If the payload is completely empty, throw a client operational error
    if (Object.keys(data).length === 0) {
      throw new BadRequestError("Please provide at least one field to update (nickname or profileImageUrl).");
    }

    const updatedUser = await userRepository.updateUser(userId, data);
    logger.info(`👤 Profile updated successfully for user ID: ${userId}`);

    return updatedUser;
  }
}
