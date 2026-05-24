import express, { type Request, type Response } from "express";

const app = express();
const PORT = 3000;

// endpoint / -> response "Hello world from our express app"
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world from our express app");
});

app.get("/students", (req: Request, res: Response) => {
  res.send("Some students data");
});

// /students/12
app.get("/students/:id", (req: Request, res: Response) => {
  const studentId = req.params.id;
  res.send(`Student data for student with id ${studentId}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
