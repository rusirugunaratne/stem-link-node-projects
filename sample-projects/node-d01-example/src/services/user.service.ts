import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import { BadRequestError } from "../errors/appError.js";
import type { User } from "../generated/prisma/client.js";
import { logger } from "../config/logger.js"; // Import logger

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || "" });
const userRepository = new UserRepository();

export class UserService{
  async findOrCreateLocalUser(clerkId: string): Promise<User> {
    let localUser = await userRepository.findByClerkId(clerkId);

    if (!localUser) {
      // Upgrade plain console outputs to structured operational telemetry
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
}
