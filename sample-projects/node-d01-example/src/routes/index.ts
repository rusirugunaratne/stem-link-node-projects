import { Router } from "express";
import userRouter from "./user.routes.js";

const globalRouter = Router();

// Mount the user routes onto /api/users
globalRouter.use("/users", userRouter);

export default globalRouter;
