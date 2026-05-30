import express, { type Request, type Response } from "express";
import movieRouter from "./routes/movie.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Base "Hello World" Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Our Modular Layered Server is Alive.");
});

// Mount the movie router!
// This means any request starting with /movies will be handed over to movie.routes.ts
app.use("/movies", movieRouter);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server running at http://localhost:${PORT}`);
});
