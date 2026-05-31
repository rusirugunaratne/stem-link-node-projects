import type { Movie } from "../database/mockDb.js";
import { MovieRepository } from "../repository/movie.repository.js";

export class MovieService {
    private movieRepository = new MovieRepository();

    getMovies(genre?: string, year?: string) : Movie[] {
        let movies = this.movieRepository.getAll();

        if(genre) {
            movies = movies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
        }

        if(year) {
            const releaseYear = parseInt(year);
            if(!isNaN(releaseYear)){
                movies = movies.filter(movie => movie.releaseYear === releaseYear);
            }
        }

        return movies;
    }

    getMovieById(id: number): Movie {
        const foundMovie = this.movieRepository.getById(id);

        if(!foundMovie){
            throw new Error("NOT_FOUND");
        }

        return foundMovie;
    }
}