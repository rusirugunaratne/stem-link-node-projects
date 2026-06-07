import type { Movie } from "../generated/prisma/client.js";
import { prisma } from "../db/prismaClient.js";

interface FetchMovieArgs {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  genre?: string | undefined;
  year?: number | undefined;
}

export class MovieRepository {
  async getAll(args: FetchMovieArgs): Promise<{movies: Movie[], total: number}> {
    const {page, limit, sortBy, sortOrder, genre, year} = args;

    const whereClause: any = {};

    if (genre) {
      whereClause.genre = {
        equals: genre, // where genre = genre
        mode: "insensitive", // case-insensitive match for the genre - Action, action
      };
    }

    if (year) {
      whereClause.releasedYear = year; // where releasedYear = year
    }

    const skip = (page -1 ) * limit;

    const [movies, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.movie.count({where: whereClause}),
    ])

    return {movies, total}
  }

  async getById(id: number): Promise<Movie | null> {
    return await prisma.movie.findUnique({
      where: { id },
    });
  }

  async getByTitle(title: string): Promise<Movie | null> {
    return await prisma.movie.findUnique({
      where: { title },
    });
  }

  async create(movieData: Omit<Movie, "id" | "createdAt">): Promise<Movie> {
    return await prisma.movie.create({
      data: movieData,
    });
  }

  async delete(id: number): Promise<Movie | null> {
    try {
      return await prisma.movie.delete({
        where: { id },
      });
    } catch {
      return null;
    }
  }
}
