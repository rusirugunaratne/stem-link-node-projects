import { Router } from "express";
import { CommentController } from "../controller/comment.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { deleteCommentSchema } from "../models/comment.schema.js";

const commentRouter = Router();
const controller = new CommentController();

commentRouter.delete("/:id", requireAuth, validate(deleteCommentSchema), controller.delete);

export default commentRouter;
