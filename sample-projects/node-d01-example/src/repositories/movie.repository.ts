import { moviesDatabase, type Movie } from "../database/mockDb.js";

export class MovieRepository{
    getAll(): Movie[] {
        return moviesDatabase;
    }

    getById(id: number): Movie | undefined {
        return moviesDatabase.find((movie) => movie.id === id);
    }

    getByTitle(title: string): Movie | undefined {
        return moviesDatabase.find((movie) => movie.title.toLowerCase() === title.toLowerCase());
    }

    create(movieData: Omit<Movie, "id">): Movie {
        const newId = moviesDatabase.length > 0
            ? Math.max(...moviesDatabase.map(movie => movie.id)) + 1
            : 1;

        const newMovie: Movie = { id: newId, ...movieData };
        moviesDatabase.push(newMovie);
        return newMovie;
    }

    delete(id: number): Movie | null {
        const targetIndex = moviesDatabase.findIndex(movie => movie.id === id);
        if (targetIndex === -1) return null;

        return moviesDatabase.splice(targetIndex, 1)[0] || null;
    }
}
