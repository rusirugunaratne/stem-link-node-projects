import { Router } from "express";
import { MovieController } from "../controller/movie.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createMovieSchema } from "../schemas/movie.schema.js";
import { getMoviesQuerySchema } from "../schemas/movie.query.schema.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.get("/movies", validate(getMoviesQuerySchema), movieController.getAllMovies);
movieRouter.get("/movies/:id", movieController.getMovieById);
movieRouter.post("/movies", validate(createMovieSchema), movieController.createMovie);
movieRouter.delete("/movies/:id", movieController.deleteMovie);
// put - update a movie by id - /api/movies/:id

export default movieRouter;
