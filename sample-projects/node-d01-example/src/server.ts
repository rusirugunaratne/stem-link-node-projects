import express, { type Request, type Response } from "express";
import movieRouter from "./routes/movie.routes.js";

const app = express();
const PORT = 3000;
app.use(express.json());


app.use("/api", movieRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
