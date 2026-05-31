import { movieDatabase, type Movie } from "../database/mockDb.js";

export class MovieRepository {
  getAll(): Movie[] {
    return movieDatabase;
  }

  getById(id: number): Movie | undefined {
    return movieDatabase.find((movie) => movie.id === id);
  }

  create(movieData: Omit<Movie, "id">): Movie {
    let newId = 1;
    if (movieDatabase.length > 0) {
      const lastMovie = movieDatabase[movieDatabase.length - 1];
      if (lastMovie) {
        newId = lastMovie.id + 1;
      }
    }

    const newMovie: Movie = {
      id: newId,
      ...movieData,
    };

    movieDatabase.push(newMovie);

    return newMovie;
  }

  deleteById(id: number): Movie | null {
    const movieIndex = movieDatabase.findIndex((movie) => movie.id === id);

    if(movieIndex === -1) {
        return null;
    }

    return movieDatabase.splice(movieIndex, 1)[0] || null;
  }
}
