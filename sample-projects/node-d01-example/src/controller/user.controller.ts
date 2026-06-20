import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import type { UpdateProfileInput } from "../models/user.schema.js";

const userService = new UserService();

export class UserController{
  getProfile = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: "User profile retrieved successfully",
      user: req.user, // Now includes karmaPoints and nickname from auth.middleware
    });
    return;
  };

  // New endpoint method to handle HTTP presentation for profile modification
  updateProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const authenticatedUserId = req.user!.id; // Guaranteed by requireAuth middleware
    const body = req.validated.body as UpdateProfileInput; // Populated by validation middleware

    const updatedUser = await userService.updateProfile(authenticatedUserId, body);

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: updatedUser.id,
        nickname: updatedUser.nickname,
        profileImageUrl: updatedUser.profileImageUrl,
        karmaPoints: updatedUser.karmaPoints,
      },
    });
  });
}
