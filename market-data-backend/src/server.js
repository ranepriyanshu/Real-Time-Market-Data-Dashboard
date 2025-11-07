import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; 

import { initRedis } from "./config/redisClient.js";
import { validateEnv } from "./middleware/validateEnv.js";
import authRouter from "./routes/auth.routes.js";
import instrumentRouter from "./routes/instrument.routes.js";
// import { setupWebSocketServer } from "./websocket/wsServer.js"; 

import { initWebSocket } from "./websocket/wsServer.js";



dotenv.config();
validateEnv();

const app = express();


app.disable("x-powered-by");


app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

const redis = await initRedis();
app.use((req, res, next) => {
  req.redis = redis;
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/instruments", instrumentRouter);


// app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/health", async (req, res) => {
  try {
    const redisStatus = redis.isReady ? "connected" : "disconnected";
    res.json({ ok: true, redis: redisStatus });
  } catch {
    res.status(500).json({ ok: false });
  }
});


app.use((req, res) => res.status(404).json({ error: "Not Found" }));


app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error"
  });
});


const server = http.createServer(app);


initWebSocket(server, redis);


const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
  console.log(`🚀 HTTP + WebSocket server running on http://localhost:${PORT}`);
});
