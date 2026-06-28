import type { Request, Response } from "express";
import { TagService } from "../service/tag.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const tagService = new TagService();

export class TagController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.validated.body;
    const tag = await tagService.createTag(name);
    res.status(201).json({ success: true, data: tag });
  });

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const tags = await tagService.getAllTags();
    res.json({ success: true, data: tags });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const { name } = req.validated.body;

    const updated = await tagService.updateTag(id, name);
    res.json({ success: true, data: updated });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;

    await tagService.deleteTag(id);
    res.json({ success: true, message: "Tag deleted successfully" });
  });
}
