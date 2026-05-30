import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";

const movieRouter = Router();
const movieController = new MovieController();

// All of these paths are relative to where this router is mounted
movieRouter.get("/", movieController.getAllMovies);
movieRouter.get("/:id", movieController.getMovieById);
movieRouter.post("/", movieController.createMovie);
movieRouter.delete("/:id", movieController.deleteMovie);

export default movieRouter;
