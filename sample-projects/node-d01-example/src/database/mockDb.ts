export interface Movie {
    id: number;
    title: string;
    genre: string;
    releaseYear: number;
}

export const moviesDatabase: Movie[] = [
    { id: 1, title: "Inception", genre: "sci-fi", releaseYear: 2010 },
    { id: 2, title: "The Dark Knight", genre: "action", releaseYear: 2008 },
    { id: 3, title: "Interstellar", genre: "sci-fi", releaseYear: 2014 },
    { id: 4, title: "Spirited Away", genre: "animation", releaseYear: 2001 },
    { id: 5, title: "The Matrix", genre: "sci-fi", releaseYear: 1999 }
];
