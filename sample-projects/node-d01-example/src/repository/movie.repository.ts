import type { Movie } from "../generated/prisma/client.js";
import { prisma } from "../db/prismaClient.js";

export class MovieRepository {
  async getAll(filters?: { genre?: string; year?: number }): Promise<Movie[]> {
    const whereClause: any = {};

    if (filters?.genre) {
      whereClause.genre = {
        equals: filters.genre, // where genre = genre
        mode: "insensitive", // case-insensitive match for the genre - Action, action
      };
    }

    if (filters?.year) {
      whereClause.releasedYear = filters.year; // where releasedYear = year
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
