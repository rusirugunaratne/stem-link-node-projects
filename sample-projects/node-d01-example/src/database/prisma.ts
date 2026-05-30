import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/moviedb";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Export a single instance to be shared across our repositories
export const prisma = new PrismaClient({ adapter });
