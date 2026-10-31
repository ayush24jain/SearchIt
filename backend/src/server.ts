
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import facultyRouter from "./routes/faculty.js";
import departmentsRouter from "./routes/departments.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json({ limit: "10kb" }));

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
