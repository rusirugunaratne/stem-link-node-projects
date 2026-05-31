import { Router } from "express";
import { MovieController } from "../controller/movie.controller.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.get("/movies", movieController.getAllMovies);
movieRouter.get("/movies/:id", movieController.getMovieById);

export default movieRouter;