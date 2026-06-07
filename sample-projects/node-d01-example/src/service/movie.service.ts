import type { Movie } from "../generated/prisma/client.js";
import { MovieRepository } from "../repository/movie.repository.js";

export class MovieService {
  private movieRepository = new MovieRepository();

  async getMovies(genre?: string, year?: string): Promise<Movie[]> {
    const filters: { genre?: string; year?: number } = {};

    if (genre) {
      filters.genre = genre;
    }

    if (year) {
      const parsedYear = parseInt(year);
      if (!isNaN(parsedYear)) {
        filters.year = parsedYear;
      }
    }

    return await this.movieRepository.getAll(filters);
  }

  async getMovieById(id: number): Promise<Movie> {
    const foundMovie = await this.movieRepository.getById(id);

    if (!foundMovie) {
      throw new Error("NOT_FOUND");
    }

    return foundMovie;
  }

  async addMovie(
    title: string,
    genre: string,
    releasedYear: number,
  ): Promise<Movie> {
    const existingMovie = await this.movieRepository.getByTitle(title);

    if (existingMovie) {
      throw new Error("DUPLICATE_TITLE");
    }

    return await this.movieRepository.create({
      title,
      genre,
      releasedYear,
    });
  }

  async deleteMovie(id: number): Promise<Movie> {
    const deletedMovie = await this.movieRepository.delete(id);

    if (!deletedMovie) {
      throw new Error("NOT_FOUND");
    }

    return deletedMovie;
  }
}
