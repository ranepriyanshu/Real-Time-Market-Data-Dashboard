// src/websocket/wsServer.js
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { userSubscriptions } from "../data/subscriptions.js";
import { generateRandomPrice } from "../utils/random.js";

const clients = new Map();

export function setupWebSocketServer(httpServer) {
  // ✅ Use /stream as per assignment
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    const { url } = req;
    if (!url.startsWith("/stream")) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  console.log("✅ WebSocket Server initialized on /stream");

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      ws.send(JSON.stringify({ error: "Missing token" }));
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.sub;
      clients.set(userId, ws);
      console.log(`🔗 User connected: ${decoded.username}`);

      ws.send(JSON.stringify({ message: "Connected to live market data" }));

      ws.on("close", () => {
        clients.delete(userId);
        console.log(`❌ Disconnected: ${decoded.username}`);
      });
    } catch (err) {
      ws.send(JSON.stringify({ error: "Invalid or expired token" }));
      ws.close();
    }
  });

  // Broadcast simulated market data every 2 seconds
  setInterval(() => {
    for (const [userId, ws] of clients.entries()) {
      const subs = Array.from(userSubscriptions.get(userId) || []);
      if (subs.length === 0) continue;

      const updates = subs.map((instrumentName) =>
        generateRandomPrice(instrumentName)
      );

      ws.send(JSON.stringify({ type: "price_update", data: updates }));
    }
  }, 2000);
}
