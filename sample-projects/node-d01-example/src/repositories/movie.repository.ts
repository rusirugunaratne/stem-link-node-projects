import { prisma } from "../database/prisma.js";
import type { Movie } from "@prisma/client";

export class MovieRepository{
    async getAll(): Promise<Movie[]> {
        return await prisma.movie.findMany();
    }

    async getById(id: number): Promise<Movie | null> {
        return await prisma.movie.findUnique({
            where: { id }
        });
    }

    async getByTitle(title: string): Promise<Movie | null> {
        return await prisma.movie.findUnique({
            where: { title }
        });
    }

    async create(movieData: Omit<Movie, "id" | "createdAt">): Promise<Movie> {
        return await prisma.movie.create({
            data: movieData
        });
    }

    async delete(id: number): Promise<Movie | null> {
        try {
            return await prisma.movie.delete({
                where: { id }
            });
        } catch {
            return null;
        }
    }
}
