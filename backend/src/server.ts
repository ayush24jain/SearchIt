
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import facultyRouter from "./routes/faculty.js";
import departmentsRouter from "./routes/departments.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/faculty", facultyRouter);
app.use("/api/departments", departmentsRouter);

const healthResponse = {
  success: true,
  message: "SearchIt backend is healthy",
};

// Main page
app.get("/", (_req, res) => {
  res.status(200).json(healthResponse);
});

// Health API
app.get("/api/health", (_req, res) => {
  res.status(200).json(healthResponse);
});

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`SearchIt backend running at http://localhost:${PORT}/`);
});
