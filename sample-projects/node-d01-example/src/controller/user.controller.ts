import type { Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { NotFoundError } from "../errors/appError.js";
import type { UpdateUserInput } from "../models/user.schema.js";

const userService = new UserService();

export class UserController {
  getProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const user = await userService.getUserProfile(userId);

    if (!user) {
      throw new NotFoundError("User profile not found");
    }

    res.json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  });

  updateProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const body = req.validated.body as UpdateUserInput;

    const user = await userService.updateUserProfile(userId, body);

    res.json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  });
}
