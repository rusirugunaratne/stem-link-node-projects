import type { Request, Response } from "express";
import { MovieService } from "../service/movie.service.js";
import type { GetMoviesQueryInput } from "../schemas/movie.query.schema.js";

export class MovieController {
  private movieService = new MovieService();

  getAllMovies = async (req: Request, res: Response) => {
    const queryFilters = req.validated.query as GetMoviesQueryInput;

    const { movies, meta } =
      await this.movieService.getPaginatedMovies(queryFilters);

    res.json({
      success: true,
      data: movies,
      meta,
    });
  };

  getMovieById = async (req: Request, res: Response) => {
    const movieIdAsString = req.params.id as string;
    const movieId = parseInt(movieIdAsString);

    if (isNaN(movieId)) {
      res.status(400).json({
        success: false,
        message: "Invalid movie id provided. Id should be a number.",
      });
      return;
    }

    try {
      const movie = await this.movieService.getMovieById(movieId);

      res.json({
        success: true,
        data: movie,
      });
    } catch (error: any) {
      if (error.message === "NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: `Movie not found for id: ${movieId}`,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  createMovie = async (req: Request, res: Response): Promise<void> => {
    const { title, genre, releasedYear, rating, description } =
      req.validated.body;

    if (!title || !genre || !releasedYear) {
      res.status(400).json({
        message:
          "Missing required fields. Please provide title, genre and releasedYear for the movie.",
        success: false,
      });
      return;
    }

    try {
      const newMovie = await this.movieService.addMovie(
        title,
        genre,
        releasedYear,
        rating,
        description,
      );

      res.status(201).json({
        success: true,
        message: "Movie created successfully",
        data: newMovie,
      });
    } catch (error: any) {
      if (error.message === "DUPLICATE_TITLE") {
        res.status(409).json({
          success: false,
          message: `A movie with the title "${title}" already exists. Please choose a different title.`,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  deleteMovie = async (req: Request, res: Response): Promise<void> => {
    const movieIdAsString = req.params.id as string;
    const movieId = parseInt(movieIdAsString);

    if (isNaN(movieId)) {
      res.status(400).json({
        success: false,
        message: "Invalid movie id provided. Id should be a number.",
      });
      return;
    }

    try {
      const deletedMovie = await this.movieService.deleteMovie(movieId);

      res.json({
        success: true,
        message: `Movie with id ${movieId} deleted successfully`,
        data: deletedMovie,
      });
    } catch (error: any) {
      if (error.message === "NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: `Movie not found for id: ${movieId}`,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };
}
