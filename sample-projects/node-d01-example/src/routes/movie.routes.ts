import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createMovieSchema } from "../schemas/movie.schema.js";

const movieRouter = Router();
const movieController = new MovieController();

// All of these paths are relative to where this router is mounted
movieRouter.get("/", movieController.getAllMovies);
movieRouter.get("/:id", movieController.getMovieById);
// intercept POST request with validation middleware before hitting controller
movieRouter.post("/", validate(createMovieSchema), movieController.createMovie);
movieRouter.delete("/:id", movieController.deleteMovie);

export default movieRouter;
