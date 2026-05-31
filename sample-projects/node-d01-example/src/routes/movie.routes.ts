import { Router } from "express";
import { MovieController } from "../controller/movie.controller.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.get("/movies", movieController.getAllMovies);
movieRouter.get("/movies/:id", movieController.getMovieById);
// get a movie by title - /api/movies?title=shawshank
movieRouter.post("/movies", movieController.createMovie);
movieRouter.delete("/movies/:id", movieController.deleteMovie);
// put - update a movie by id - /api/movies/:id

export default movieRouter;
