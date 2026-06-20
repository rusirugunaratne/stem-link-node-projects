import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js"; // Import validator middleware
import { updateProfileSchema } from "../models/user.schema.js"; // Import schema

const userRouter = Router();
const userController = new UserController();

// Public/Authenticated Profile Reading
userRouter.get("/profile", requireAuth, userController.getProfile);

// Authenticated & Validated Profile Writing
userRouter.put(
  "/profile",
  requireAuth,
  validate(updateProfileSchema),
  userController.updateProfile
);

export default userRouter;