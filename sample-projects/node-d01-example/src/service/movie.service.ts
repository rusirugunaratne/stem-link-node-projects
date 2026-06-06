import type { Movie } from "../generated/prisma/client.js";
import { MovieRepository } from "../repository/movie.repository.js";
import type { GetMoviesQueryInput } from "../schemas/movie.query.schema.js";

export class MovieService {
  private movieRepository = new MovieRepository();

  async getPaginatedMovies(filters: GetMoviesQueryInput) {
    const parsedYear = filters.year ? parseInt(filters.year, 10) : undefined;

    const { movies, total } = await this.movieRepository.getAllAndCount({
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      genre: filters.genre,
      year: isNaN(parsedYear!) ? undefined : parsedYear,
    });

    const totalPages = Math.ceil(total / filters.limit);

    return {
      movies,
      meta: {
        totalItems: total,
        itemCount: movies.length,
        itemsPerPage: filters.limit,
        currentPage: filters.page,
        totalPages,
      },
    };
  }

  async getMovies(genre?: string, year?: string): Promise<Movie[]> {
    const filters: { genre?: string; year?: number } = {};

    if (genre) {
      filters.genre = genre;
    }

    if (year) {
      const parsedYear = parseInt(year, 10);
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
    rating?: number,
    description?: string,
  ): Promise<Movie> {
    const existingMovie = await this.movieRepository.getByTitle(title);
    if (existingMovie) {
      throw new Error("DUPLICATE_TITLE");
    }

    const parsedYear = parseInt(releasedYear as any, 10);

    return await this.movieRepository.create({
      title,
      genre,
      releasedYear: parsedYear,
      rating: rating ?? 0.0,
      description: description ?? "No description provided.",
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
