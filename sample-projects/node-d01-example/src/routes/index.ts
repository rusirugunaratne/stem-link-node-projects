import { Router } from "express";
import userRouter from "./user.routes.js";
import submissionRouter from "./submission.routes.js";
import storageRouter from "./storage.routes.js"; // Import new storage router

const globalRouter = Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/submissions", submissionRouter);
globalRouter.use("/storage", storageRouter); // Mount storage onto /api/storage

export default globalRouter;
