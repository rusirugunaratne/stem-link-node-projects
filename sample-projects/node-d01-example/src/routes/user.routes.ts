import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = Router();
const userController = new UserController();

// Secure this route using our brand-new middleware
userRouter.get("/profile", requireAuth, userController.getProfile);

export default userRouter;
