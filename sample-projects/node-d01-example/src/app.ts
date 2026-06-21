import express from "express";
import "dotenv/config";
import globalRouter from "./routes/index.js";
import { clerkMiddleware } from '@clerk/express'
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import type { CorsOptions } from "cors";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}

app.use(cors(corsOptions));

// Parsers
app.use(express.json());

app.use(clerkMiddleware());

// API Mounting
app.use("/api", globalRouter);

// Fallback for 404 Route handling
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});
