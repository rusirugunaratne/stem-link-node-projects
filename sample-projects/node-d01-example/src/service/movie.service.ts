import type { Movie } from "../generated/prisma/client.js";
import { MovieRepository } from "../repository/movie.repository.js";
import type { GetMoviesQueryInput } from "../schemas/movie.query.schema.js";

export class MovieService {
  private movieRepository = new MovieRepository();

  async getPaginatedMovies(filters: GetMoviesQueryInput) {
    const parsedYear = filters.year ? parseInt(filters.year) : undefined;

    const { movies, total } = await this.movieRepository.getAll({
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      genre: filters.genre,
      year: parsedYear,
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

    return await this.movieRepository.create({
      title,
      genre,
      releasedYear,
      rating: rating ?? 0.0,
      description: description || "",
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
