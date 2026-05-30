import { MovieRepository } from "../repositories/movie.repository.js";
import type { Movie } from "@prisma/client";

export class MovieService{
    private movieRepository = new MovieRepository();

    async getMovies(genre?: string, year?: string): Promise<Movie[]> {
        let movies = await this.movieRepository.getAll();

        if (genre) {
            movies = movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
        }

        if (year) {
            const parsedYear = parseInt(year, 10);
            if (!isNaN(parsedYear)) {
                movies = movies.filter(m => m.releaseYear === parsedYear);
            }
        }

        return movies;
    }

    async getMovieById(id: number): Promise<Movie> {
        const movie = await this.movieRepository.getById(id);
        if (!movie) {
            throw new Error("NOT_FOUND");
        }
        return movie;
    }

    async addMovie(title: string, genre: string, releaseYear: number): Promise<Movie> {
        const existingMovie = await this.movieRepository.getByTitle(title);
        if (existingMovie) {
            throw new Error("DUPLICATE_TITLE");
        }

        const parsedYear = parseInt(releaseYear as any, 10);

        return await this.movieRepository.create({
            title,
            genre,
            releaseYear: parsedYear
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
