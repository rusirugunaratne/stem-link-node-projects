import path from "node:path";
import { BadRequestError } from "../errors/appError.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r3Client } from "../config/storage.js";
import { logger } from "../config/logger.js";

export class StorageService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        if(!file) {
            throw new BadRequestError("No binary file payload received");
        }

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        const objectKey = `images/${uniqueSuffix}${fileExtension}`;

        try {
            const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: objectKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await r3Client.send(command);
            logger.info(`File uploaded to R2 ${objectKey}`);

            return `${process.env.R2_PUBLIC_DOMAIN_URL}/${objectKey}`;
        } catch(error: any) {
            logger.error("Failed to upload file to R2", {message: error.message});
            throw new Error("Failed to upload file to remote asset server");
        }
        
    }
}