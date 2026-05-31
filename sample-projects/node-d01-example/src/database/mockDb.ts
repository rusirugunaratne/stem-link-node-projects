export interface MovieModel {
  id: number;
  title: string;
  genre: string;
  releasedYear: number;
}

export const movieDatabase: MovieModel[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    genre: "Drama",
    releasedYear: 1994,
  },
  { id: 2, title: "The Godfather", genre: "Crime", releasedYear: 1972 },
  { id: 3, title: "The Dark Knight", genre: "Action", releasedYear: 2008 },
  { id: 4, title: "Pulp Fiction", genre: "Crime", releasedYear: 1994 },
  { id: 5, title: "Forrest Gump", genre: "Drama", releasedYear: 1994 },
];
