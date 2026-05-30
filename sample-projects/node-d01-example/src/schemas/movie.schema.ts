// src/schemas/movie.schema.ts
import { z } from "zod";

// Define the validation blueprint for creating a movie
export const createMovieSchema = z.object({
    body: z.object({
        title: z.string({
            message: "Title is strictly required"
        }).min(1, "Title cannot be empty string").trim(),

        genre: z.string({
            message: "Genre is strictly required"
        }).min(2, "Genre must be at least 2 characters long").trim(),

        releaseYear: z.number({
            message: "Release year must be a valid number"
        })
        .int("Release year must be an integer")
        .min(1888, "The first movie ever made was in 1888") // Fun history lesson flag for students!
        .max(new Date().getFullYear() + 5, "Release year cannot be too far in the future")
    })
});

// We can infer types directly from our Zod schemas if needed elsewhere
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
