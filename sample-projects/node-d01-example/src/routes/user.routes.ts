import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateUserSchema } from "../models/user.schema.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/profile", requireAuth, userController.getProfile);
userRouter.put("/profile", requireAuth, validate(updateUserSchema), userController.updateProfile);

export default userRouter;