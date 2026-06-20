import type { Request, Response } from "express";
import { StorageService } from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { BadRequestError } from "../errors/appError.js";

const storageService = new StorageService();

export class StorageController{
  uploadFile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Multer populates req.file when intercepting multipart uploads successfully
    if (!req.file) {
      throw new BadRequestError("Please provide an image asset file under the 'file' key parameter.");
    }

    const fileUrl = await storageService.uploadImage(req.file);

    res.status(201).json({
      success: true,
      message: "Asset uploaded successfully.",
      data: {
        fileUrl,
      },
    });
  });
}
