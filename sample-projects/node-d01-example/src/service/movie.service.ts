import type { Movie } from "../generated/prisma/client.js";
import type { MovieModel } from "../database/mockDb.js";
import { MovieRepository } from "../repository/movie.repository.js";

export class MovieService {
  private movieRepository = new MovieRepository();

  async getMovies(genre?: string, year?: string): Promise<Movie[]> {
    let movies = await this.movieRepository.getAll();

    if (genre) {
      movies = movies.filter(
        (movie) => movie.genre.toLowerCase() === genre.toLowerCase(),
      );
    }

    if (year) {
      const releasedYear = parseInt(year);
      if (!isNaN(releasedYear)) {
        movies = movies.filter((movie) => movie.releasedYear === releasedYear);
      }
    }

    return movies;
  }

  async getMovieById(id: number): Promise<Movie> {
    const foundMovie =  await this.movieRepository.getById(id);

    if (!foundMovie) {
      throw new Error("NOT_FOUND");
    }

    return foundMovie;
  }

  addMovie(title: string, genre: string, releasedYear: number): MovieModel {
    return this.movieRepository.create({
      title,
      genre,
      releasedYear,
    });
  }

  deleteMovie(id: number): MovieModel {
    const deletedMovie = this.movieRepository.deleteById(id);

    if (!deletedMovie) {
      throw new Error("NOT_FOUND");
    }

    return deletedMovie;
  }
}
