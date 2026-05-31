import type { Movie } from "../generated/prisma/client.js";
import { movieDatabase, type MovieModel } from "../database/mockDb.js";
import { prisma } from "../db/prismaClient.js";

export class MovieRepository {
  async getAll(): Promise<Movie[]> {
    return await prisma.movie.findMany();
  }

  async getById(id: number): Promise<Movie | null> {
    return await prisma.movie.findUnique({
      where: { id },
    });
  }


  

  create(movieData: Omit<MovieModel, "id">): MovieModel {
    let newId = 1;
    if (movieDatabase.length > 0) {
      const lastMovie = movieDatabase[movieDatabase.length - 1];
      if (lastMovie) {
        newId = lastMovie.id + 1;
      }
    }

    const newMovie: MovieModel = {
      id: newId,
      ...movieData,
    };

    movieDatabase.push(newMovie);

    return newMovie;
  }

  deleteById(id: number): MovieModel | null {
    const movieIndex = movieDatabase.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
      return null;
    }

    return movieDatabase.splice(movieIndex, 1)[0] || null;
  }
}
