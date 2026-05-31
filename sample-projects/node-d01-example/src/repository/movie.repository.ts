import { movieDatabase, type Movie } from "../database/mockDb.js";

export class MovieRepository {
    getAll(): Movie[] {
        return movieDatabase;
    }

    getById(id: number): Movie | undefined {
        return movieDatabase.find((movie) => movie.id === id);
    }
}