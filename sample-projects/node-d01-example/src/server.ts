import express, { type Request, type Response } from "express";
import movieRouter from "./routes/movie.routes.js";

interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
}

// 200 OK - The request has succeeded. The meaning of the success depends on the HTTP method:
// 201 Created - The request has been fulfilled and has resulted in one or more new resources being created.
// 400 Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
// 404 Not Found - The server can't find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
// 500 Internal Server Error - The server has encountered a situation it doesn't know how to handle.

const movieDatabase: Movie[] = [
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

const app = express();
const PORT = 3000;
app.use(express.json());

// // [GET] /api/movies?genre=<genr    e> - Get all movies
// app.get("/api/movies", (req: Request, res: Response) => {
//   const genreQuery = req.query.genre as string;
//   const yearQuery = req.query.year as string;

//   let filteredMovies = movieDatabase;

//   if (genreQuery) {
//     filteredMovies = movieDatabase.filter(
//       (movie) =>
//         movie.genre.toLocaleLowerCase() === genreQuery.toLocaleLowerCase(),
//     );
//   }

//   if (yearQuery) {
//     const year = parseInt(yearQuery);
//     if (!isNaN(year)) {
//       filteredMovies = filteredMovies.filter(
//         (movie) => movie.releaseYear === year,
//       );
//     }
//   }

//   res.json(filteredMovies);
// });

// app.get("/api/movies/:id", (req: Request, res: Response) => {
//   const movieIdAsString = req.params.id as string;
//   const movieId = parseInt(movieIdAsString);

//   const foundMovie = movieDatabase.find((movie) => movie.id === movieId);

//   if (!foundMovie) {
//     res.status(404).json({
//       success: false,
//       message: `Movie not found for id: ${movieId}`,
//     });
//     return;
//   }

//   res.json({
//     success: true,
//     data: foundMovie,
//   });
// });

app.post("/api/movies", (req: Request, res: Response) => {
  const { title, genre, releaseYear } = req.body;

  if (!title || !genre || !releaseYear) {
    res.status(400).json({
      success: false,
      message: "Missing required fields: title, genre, releaseYear",
    });
    return;
  }

  let newId = 1;
  if (movieDatabase.length > 0) {
    const lastMovie = movieDatabase[movieDatabase.length - 1];
    if (lastMovie) {
      newId = lastMovie.id + 1;
    }
  }

  const newMovie: Movie = {
    id: newId,
    title,
    genre,
    releaseYear,
  };

  movieDatabase.push(newMovie);

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: newMovie,
  });
});

app.delete("/api/movies/:id", (req: Request, res: Response) => {
  const targetIdAsString = req.params.id as string;
  const targetId = parseInt(targetIdAsString);

  if (isNaN(targetId)) {
    res.status(400).json({
      success: false,
      message: "Invalid movie id",
    });
    return;
  }

  const movieIndex = movieDatabase.findIndex((movie) => movie.id === targetId);

  if (movieIndex === -1) {
    res.status(404).json({
      success: false,
      message: `Movie not found for id: ${targetId}`,
    });
    return;
  }

  movieDatabase.splice(movieIndex, 1);

  res.json({
    success: true,
    message: `Movie with id ${targetId} deleted successfully`,
  });
});

app.put("/api/movies/:id", (req: Request, res: Response) => {
  const targetIdAsString = req.params.id as string;
  const targetId = parseInt(targetIdAsString);

  if (isNaN(targetId)) {
    res.status(400).json({
      success: false,
      message: "Invalid movie id",
    });
    return;
  }

  const movieIndex = movieDatabase.findIndex((movie) => movie.id === targetId);

  if (movieIndex === -1) {
    res.status(404).json({
      success: false,
      message: `Movie not found for id: ${targetId}`,
    });
    return;
  }

  const { title, genre, releaseYear } = req.body;

  if (!title || !genre || !releaseYear) {
    res.status(400).json({
      success: false,
      message: "Missing required fields: title, genre, releaseYear",
    });
    return;
  }

  const updatedMovie: Movie = {
    id: targetId,
    title,
    genre,
    releaseYear,
  };

  movieDatabase[movieIndex] = updatedMovie;

  res.json({
    success: true,
    message: `Movie with id ${targetId} updated successfully`,
    data: updatedMovie,
  });
});

app.use("/api", movieRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
