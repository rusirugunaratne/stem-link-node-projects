import type { Request, Response } from "express";

export class UserController {
  getProfile = async (req: Request, res: Response): Promise<void> => {
    // req.user is instantly available because of our requireAuth middleware!
    res.json({
      success: true,
      message: "Successfully retrieved secure profile information.",
      user: req.user,
    });
  };
}
