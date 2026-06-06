import type { Movie } from "../generated/prisma/client.js";
import { prisma } from "../db/prismaClient.js";

interface FetchMoviesArgs {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  genre?: string | undefined;
  year?: number | undefined;
}

export class MovieRepository {
  async getAllAndCount(args: FetchMoviesArgs): Promise<{ movies: Movie[]; total: number }> {
    const { page, limit, sortBy, sortOrder, genre, year } = args;

    // 1. Construct dynamic where clauses
    const whereClause: any = {};
    if (genre) {
      whereClause.genre = { equals: genre, mode: "insensitive" };
    }
    if (year) {
      whereClause.releasedYear = year;
    }

    // 2. Calculate pagination metrics
    const skip = (page - 1) * limit;

    // 3. Execute both queries in parallel using a database transaction
    const [movies, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.movie.count({ where: whereClause }),
    ]);

    return { movies, total };
  }

  async getAll(filters?: { genre?: string; year?: number }): Promise<Movie[]> {
    const whereClause: any = {};

    if (filters?.genre) {
      whereClause.genre = {
        equals: filters.genre,
        mode: "insensitive", // Makes the search case-insensitive natively in the DB
      };
    }

    if (filters?.year) {
      whereClause.releasedYear = filters.year;
    }

    return await prisma.movie.findMany({
      where: whereClause,
    });
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
