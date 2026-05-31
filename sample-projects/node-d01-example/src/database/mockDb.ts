export interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
}

export const movieDatabase: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    genre: "Drama",
    releaseYear: 1994,
  },
  { id: 2, title: "The Godfather", genre: "Crime", releaseYear: 1972 },
  { id: 3, title: "The Dark Knight", genre: "Action", releaseYear: 2008 },
  { id: 4, title: "Pulp Fiction", genre: "Crime", releaseYear: 1994 },
  { id: 5, title: "Forrest Gump", genre: "Drama", releaseYear: 1994 },
];