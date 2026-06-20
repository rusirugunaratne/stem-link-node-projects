import winston from "winston";

// Define log severity levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Detect current environment
const environment = process.env.NODE_ENV || "development";

// Determine which log levels to capture based on environment
// Print everything 'debug' and above in development; filter down to 'info' in production
const level = () => {
  return environment === "development" ? "debug" : "info";
};

// Define clean colors for console logs
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};
winston.addColors(colors);

// Custom format for local developer readability
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

// High-performance JSON format optimized for cloud aggregators
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Build and export the single shared logger instance
export const logger = winston.createLogger({
  level: level(),
  levels,
  format: environment === "development" ? developmentFormat : productionFormat,
  transports: [
    // Standard Output Stream (Required for Docker/Cloud Hosting environments)
    new winston.transports.Console(),
  ],
});
