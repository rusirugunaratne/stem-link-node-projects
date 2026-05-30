import { MovieRepository } from "../repositories/movie.repository.js";
import { type Movie } from "../database/mockDb.js";

export class MovieService{
    private movieRepository = new MovieRepository();

    getMovies(genre?: string, year?: string): Movie[] {
        let movies = this.movieRepository.getAll();

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

    getMovieById(id: number): Movie {
        const movie = this.movieRepository.getById(id);
        if (!movie) {
            throw new Error("NOT_FOUND");
        }
        return movie;
    }

    addMovie(title: string, genre: string, releaseYear: number): Movie {
        // Business Rule: Check for duplicate titles
        const existingMovie = this.movieRepository.getByTitle(title);
        if (existingMovie) {
            throw new Error("DUPLICATE_TITLE");
        }

        const parsedYear = parseInt(releaseYear as any, 10);

        return this.movieRepository.create({
            title,
            genre,
            releaseYear: parsedYear
        });
    }

    deleteMovie(id: number): Movie {
        const deletedMovie = this.movieRepository.delete(id);
        if (!deletedMovie) {
            throw new Error("NOT_FOUND");
        }
        return deletedMovie;
    }
}
