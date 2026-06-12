import type { Request, Response, NextFunction } from "express";
import { createClerkClient, getAuth } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import { UnauthorizedError, BadRequestError } from "../errors/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Initialize the Clerk client to fetch profile details when needed
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

const userRepository = new UserRepository();

// Extend the Express Request interface so TypeScript knows about req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        clerkId: string;
        email: string;
      };
    }
  }
}

export const requireAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Check if the global clerkMiddleware successfully authenticated the token
    const auth = getAuth(req);
    const clerkId = auth.userId;

    if (!clerkId) {
      throw new UnauthorizedError("Missing or invalid authentication token.");
    }

    // 2. Check if the user already exists in our local PostgreSQL database
    let localUser = await userRepository.findByClerkId(clerkId);

    // 3. If the user does NOT exist in our DB, execute Just-In-Time (JIT) syncing
    if (!localUser) {
      console.log(
        `🔄 Syncing new user from Clerk to Local DB (Clerk ID: ${clerkId})`,
      );

      // Fetch full profile info from Clerk API using the authenticated clerkId
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        throw new BadRequestError(
          "Clerk user profile does not contain an email address.",
        );
      }

      // Create the user data object conditionally for exactOptionalPropertyTypes
      const userData: any = {
        clerkId: clerkUser.id,
        email: email,
      };
      if (clerkUser.firstName) {
        userData.firstName = clerkUser.firstName;
      }
      if (clerkUser.lastName) {
        userData.lastName = clerkUser.lastName;
      }

      // Create the user row in our PostgreSQL table
      localUser = await userRepository.createUser(userData);
    }

    // 4. Attach the local database user info to the request object
    // This allows downstream route controllers to easily know exactly WHO is making the request
    req.user = {
      id: localUser.id,
      clerkId: localUser.clerkId,
      email: localUser.email,
    };

    next();
  },
);
