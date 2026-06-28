import { Router } from "express";
import { TagController } from "../controller/tag.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTagSchema, updateTagSchema, tagIdParamSchema } from "../models/tag.schema.js";

const tagRouter = Router();
const controller = new TagController();

tagRouter.get("/", controller.getAll);
tagRouter.post("/", requireAuth, validate(createTagSchema), controller.create);
tagRouter.put("/:id", requireAuth, validate(updateTagSchema), controller.update);
tagRouter.delete("/:id", requireAuth, validate(tagIdParamSchema), controller.delete);

export default tagRouter;
