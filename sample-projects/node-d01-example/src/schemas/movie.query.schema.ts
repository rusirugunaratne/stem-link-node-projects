import { z } from "zod";

export const getMoviesQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => Math.max(1, parseInt(val, 10) || 1)),

    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => {
        const parsed = parseInt(val, 10) || 10;
        return Math.min(100, Math.max(1, parsed)); // Cap maximum limit at 100 for safety
      }),

    sortBy: z
      .enum(["title", "releasedYear", "rating", "createdAt"])
      .optional()
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .default("desc"),

    genre: z.string().optional(),
    year: z.string().optional(),
  }),
});

export type GetMoviesQueryInput = z.infer<typeof getMoviesQuerySchema>["query"];
