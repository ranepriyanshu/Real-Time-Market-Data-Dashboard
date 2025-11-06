import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // 👈 important for combining HTTP + WS

import { validateEnv } from "./middleware/validateEnv.js";
import authRouter from "./routes/auth.routes.js";
import instrumentRouter from "./routes/instrument.routes.js";
import { setupWebSocketServer } from "./websocket/wsServer.js"; // 👈 import WebSocket setup

// Load environment variables
dotenv.config();
validateEnv();

const app = express();

// Basic hardening
app.disable("x-powered-by");

// Parse JSON bodies
app.use(express.json());

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

// REST API routes
app.use("/api/auth", authRouter);
app.use("/api/instruments", instrumentRouter);

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error"
  });
});

// ✅ Create a combined HTTP server
const server = http.createServer(app);

// ✅ Initialize WebSocket server
setupWebSocketServer(server);

// ✅ Start listening (both HTTP + WebSocket)
const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
  console.log(`🚀 HTTP + WebSocket server running on http://localhost:${PORT}`);
});
