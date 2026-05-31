import type { Request, Response } from "express";
import { MovieService } from "../service/movie.service.js";

export class MovieController {
  private movieService = new MovieService();

  getAllMovies = (req: Request, res: Response) => {
    const genreQuery = req.query.genre as string;
    const yearQuery = req.query.year as string;

    const movies = this.movieService.getMovies(genreQuery, yearQuery);

    res.json({
      success: true,
      data: movies,
      count: movies.length,
    });
  };

  getMovieById = (req: Request, res: Response) => {
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
      const movie = this.movieService.getMovieById(movieId);

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

  createMovie = (req: Request, res: Response) => {
    const { title, genre, releaseYear } = req.body;

    if (!title || !genre || !releaseYear) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, genre, releaseYear",
      });
      return;
    }

    const newMovie = this.movieService.addMovie(title, genre, releaseYear);

    res.status(201).json({
      success: true,
      data: newMovie,
    });
  };

  deleteMovie = (req: Request, res: Response) => {
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
      const deletedMovie = this.movieService.deleteMovie(movieId);

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
