import express from "express";
import cors from "cors"; // 1. Import the cors middleware
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import globalRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Parse out the allowed origins array from the environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

// 3. Configure the CORS middleware options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if the incoming request origin matches anything in our whitelist array
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Block the request if the domain is untrusted
      callback(new Error(`Not allowed by CORS: Origin '${origin}' is blocked.`));
    }
  },
  credentials: true, // Crucial if your students plan to store cookies/session tokens across domains
};

// 4. Mount CORS at the absolute top of the middleware stack
app.use(cors(corsOptions));

// Standard Parsers
app.use(express.json());

// Auth Initialization
app.use(clerkMiddleware());

// API Mounting
app.use("/api", globalRouter);

// Fallback for 404 Route handling
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 StackOverflow Clone Server running perfectly on http://localhost:${PORT}`);
});
