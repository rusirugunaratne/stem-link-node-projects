import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";

export const r3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT_URL || "",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    }
});

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5MB
    },
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Invalide file type: only jpeg, png and webp supported"));
        }
    }
});