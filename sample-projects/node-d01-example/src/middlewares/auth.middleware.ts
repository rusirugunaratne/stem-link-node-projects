import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { UserService } from "../services/user.service.js";
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
        karmaPoints: number;
        nickname: string | null;
        profileImageUrl: string | null;
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
    throw new UnauthorizedError("Missing or invalid authentication token.");
  }

  // Delegate core execution mapping entirely to the service
  const localUser = await userService.findOrCreateLocalUser(clerkId);

  req.user = {
    id: localUser.id,
    clerkId: localUser.clerkId,
    email: localUser.email,
    karmaPoints: localUser.karmaPoints,
    nickname: localUser.nickname,
    profileImageUrl: localUser.profileImageUrl,
  };

  next();
});
