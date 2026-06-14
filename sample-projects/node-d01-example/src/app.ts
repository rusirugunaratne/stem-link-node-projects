import express from "express";
import "dotenv/config";
import globalRouter from "./routes/index.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();
const PORT = process.env.PORT || 3000;

// Parsers
app.use(express.json());

app.use(clerkMiddleware());

// API Mounting
app.use("/api", globalRouter);

// Fallback for 404 Route handling
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});
