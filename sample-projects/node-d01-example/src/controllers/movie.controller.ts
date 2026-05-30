import type { Request, Response } from "express";
import { MovieService } from "../services/movie.service.js";

export class MovieController{
    private movieService = new MovieService();

    getAllMovies = async (req: Request, res: Response): Promise<void> => {
        const genre = req.query.genre as string | undefined;
        const year = req.query.year as string | undefined;

        try {
            const movies = await this.movieService.getMovies(genre, year);
            res.json({
                success: true,
                count: movies.length,
                data: movies
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error." });
        }
    };

    getMovieById = async (req: Request, res: Response): Promise<void> => {
        const idNumber = parseInt(req.params.id as string, 10);

        if (isNaN(idNumber)) {
            res.status(400).json({ success: false, message: "Invalid ID format. Expected a number." });
            return;
        }

        try {
            const movie = await this.movieService.getMovieById(idNumber);
            res.json({ success: true, data: movie });
        } catch (error: any) {
            if (error.message === "NOT_FOUND") {
                res.status(404).json({ success: false, message: "Movie not found." });
            } else {
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        }
    };

    createMovie = async (req: Request, res: Response): Promise<void> => {
        const { title, genre, releaseYear } = req.body;

        if (!title || !genre || !releaseYear) {
            res.status(400).json({
                success: false,
                message: "Validation Error: title, genre, and releaseYear are required fields."
            });
            return;
        }

        try {
            const newMovie = await this.movieService.addMovie(title, genre, releaseYear);
            res.status(201).json({
                success: true,
                message: "New movie added successfully!",
                data: newMovie
            });
        } catch (error: any) {
            if (error.message === "DUPLICATE_TITLE") {
                res.status(409).json({ success: false, message: `Conflict Error: "${title}" already exists.` });
            } else {
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        }
    };

    deleteMovie = async (req: Request, res: Response): Promise<void> => {
        const idNumber = parseInt(req.params.id as string, 10);

        if (isNaN(idNumber)) {
            res.status(400).json({ success: false, message: "Invalid ID parameter supplied." });
            return;
        }

        try {
            const deleted = await this.movieService.deleteMovie(idNumber);
            res.json({
                success: true,
                message: `Successfully removed movie "${deleted.title}".`,
                data: deleted
            });
        } catch (error: any) {
            if (error.message === "NOT_FOUND") {
                res.status(404).json({ success: false, message: "Delete Failed: Movie not found." });
            } else {
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        }
    };
}
