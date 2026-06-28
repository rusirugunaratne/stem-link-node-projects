import { Router } from "express";
import userRouter from "./user.routes.js";
import submissionRouter from "./submission.routes.js";
import storageRouter from "./storage.routes.js";
import tagRouter from "./tag.routes.js";
import commentRouter from "./comment.routes.js";

const globalRouter = Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/submissions", submissionRouter);
globalRouter.use("/storage", storageRouter); // Mount storage onto /api/storage
globalRouter.use("/tags", tagRouter);
globalRouter.use("/comments", commentRouter);

export default globalRouter;
