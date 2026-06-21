import morgan from "morgan";
import { logger } from "../config/logger.js";

// Override Morgan's default stream to use our custom Winston instance
const stream = {
  write: (message: string) => logger.http(message.trim()),
};

// Build the middleware configuration
export const morganMiddleware = morgan(
  // Production-ready log format tokens
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);
