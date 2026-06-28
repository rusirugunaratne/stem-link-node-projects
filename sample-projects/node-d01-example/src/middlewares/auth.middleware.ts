import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { UnauthorizedError } from "../errors/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const userService = new UserService();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        clerkId: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
      };
    }
  }
}

export const requireAuth = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const auth = getAuth(req);
  const clerkId = auth.userId;

  if (!clerkId) {
    throw new UnauthorizedError("Missing or invalid authentication token");
  }

  const localUser = await userService.findOrCreateLocalUser(clerkId);
  req.user = {
    id: localUser.id,
    clerkId: localUser.clerkId,
    email: localUser.email,
  };

  next();
});
