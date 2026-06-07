import z from "zod";

export const createMovieSchema = z.object({
  body: z.object({
    title: z
      .string({
        message: "Title is required and should be a string.",
      })
      .min(1, "Title cannot be empty.")
      .trim(),

    genre: z
      .string({
        message: "Genre is required and should be a string.",
      })
      .min(2, "Genre should be at least 2 characters long.")
      .trim(),

    releasedYear: z
      .number({
        message: "Released year is required and should be a number.",
      })
      .int("Released year should be an integer.")
      .min(1888, "Released year should be a valid year.") // The first film was made in 1888, so we can use that as a minimum year.
      .max(
        new Date().getFullYear() + 5,
        "Released year should not be in the future.",
      ),

    rating: z
      .number()
      .min(0, "Rating should be at least 0.")
      .max(10, "Rating should be at most 10.")
      .default(0.0),

    description: z
      .string()
      .max(500, "Description should be at most 500 characters long.")
      .optional(),
  }),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
