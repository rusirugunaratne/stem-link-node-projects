import type { Request, Response } from "express";
import { MovieService } from "../service/movie.service.js";
import type { GetMoviesQueryInput } from "../schemas/movie.query.schema.js";

export class MovieController {
  private movieService = new MovieService();

  getAllMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      // req.validated is fully populated and transformed by Zod at this stage!
      const queryFilters = req.validated.query as GetMoviesQueryInput;

      const { movies, meta } = await this.movieService.getPaginatedMovies(queryFilters);

      res.json({
        success: true,
        meta,
        data: movies,
      });
    } catch (error) {
      console.error("Error in getAllMovies:", error);
      res.status(500).json({ success: false, message: "Internal server error execution." });
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
        res.status(404).json({ success: false, message: `Movie not found for id: ${idNumber}` });
      } else {
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    }
  };

  createMovie = async (req: Request, res: Response): Promise<void> => {
    // Zod has already validated these properties exist and match types perfectly!
    const { title, genre, releasedYear, rating, description } = req.validated.body;

    try {
      const newMovie = await this.movieService.addMovie(title, genre, releasedYear, rating, description);
      res.status(201).json({
        success: true,
        message: "New movie added successfully!",
        data: newMovie,
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
      res.status(400).json({ success: false, message: "Invalid movie id provided. Id should be a number." });
      return;
    }

    try {
      const deleted = await this.movieService.deleteMovie(idNumber);
      res.json({
        success: true,
        message: `Successfully removed movie "${deleted.title}".`,
        data: deleted,
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
