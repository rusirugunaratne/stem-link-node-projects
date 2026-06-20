import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import "dotenv/config";

// 1. Initialize the S3 Client pointed directly at Cloudflare's R2 endpoint
export const r3Client = new S3Client({
  region: "auto", // Cloudflare R2 manages regions automatically
  endpoint: process.env.R2_ENDPOINT_URL || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

// 2. Configure Multer to retain uploaded binary data entirely within temporary memory buffers
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Enforce strict 5MB maximum file size limit
  },
  fileFilter: (req, file, callback) => {
    // Whitelist secure, standard web image mime-types
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type. Only JPEG, PNG, and WEBP formats are accepted."));
    }
  },
});
