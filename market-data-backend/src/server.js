import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { validateEnv } from "./middleware/validateEnv.js";
import authRouter from "./routes/auth.routes.js";
import instrumentRouter from "./routes/instrument.routes.js";


dotenv.config();
validateEnv();

const app = express();

// Basic hardening (add more later)
app.disable("x-powered-by");

// Parse JSON bodies
app.use(express.json());

// CORS: allow your frontend origin
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/instruments", instrumentRouter);

// Healthcheck (useful for Docker later)
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", authRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Centralized error handler (keeps error shape consistent)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});
