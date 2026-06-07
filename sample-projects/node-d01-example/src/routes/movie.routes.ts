import { Router } from "express";
import { MovieController } from "../controller/movie.controller.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.get("/movies", movieController.getAllMovies);
movieRouter.get("/movies/:id", movieController.getMovieById);
movieRouter.post("/movies", movieController.createMovie);
movieRouter.delete("/movies/:id", movieController.deleteMovie);
// put - update a movie by id - /api/movies/:id

export default movieRouter;
