import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r3Client } from "../config/storage.js";
import { BadRequestError } from "../errors/appError.js";
import { logger } from "../config/logger.js";
import path from "path";

export class StorageService{
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestError("No binary file payload received.");
    }

    // Generate an un-clashable unique object key name (timestamp + random string + original extension)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const objectKey = `profiles/${uniqueSuffix}${fileExtension}`;

    try {
      // Execute standard PutObjectCommand parameter blueprint structures
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
        Body: file.buffer, // Feed raw memory stream data directly
        ContentType: file.mimetype,
      });

      await r3Client.send(command);
      logger.info(`💾 Secure file asset streamed successfully to R2 bucket: ${objectKey}`);

      // Reconstruct and return the fully resolved public domain string path
      return `${process.env.R2_PUBLIC_DOMAIN_URL}/${objectKey}`;
    } catch (error: any) {
      logger.error("❌ CLOUDFLARE R2 OBJECT STORAGE UPLOAD FAILURE:", { message: error.message });
      throw new Error("Failed to upload file to remote asset servers.");
    }
  }
}
