import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { getUserSubscriptions } from "../data/subscriptions.js";

/**
 * Initialize WebSocket server
 * @param {import('http').Server} server
 * @param {import('redis').RedisClientType} redis
 */
export function initWebSocket(server, redis) {
  const wss = new WebSocketServer({ server });
  console.log("✅ WebSocket server started");

  
  wss.on("connection", async (ws, req) => {
    try {
    
      const params = new URLSearchParams(req.url.split("?")[1]);
      const token = params.get("token");
      if (!token) {
        ws.close(1008, "Missing token");
        return;
      }

      
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.sub || payload.id;

      console.log(`🟢 User connected: ${userId}`);

      
      const subs = await getUserSubscriptions(redis, userId);
      console.log(`📦 Restored ${subs.length} subscriptions for ${userId}`);

      
      ws.send(
        JSON.stringify({
          type: "connected",
          message: `Welcome ${userId}`,
          subscriptions: subs,
        })
      );

    
      const sendMarketData = async () => {
        const instruments = await getUserSubscriptions(redis, userId);
        instruments.forEach((symbol) => {
          const price = (Math.random() * 1000).toFixed(2);
          const quantity = Math.floor(Math.random() * 100);
          const msg = {
            type: "market_data",
            instrumentName: symbol,
            lastTradedPrice: Number(price),
            lastTradedQuantity: quantity,
            lastTradedDateTime: new Date().toISOString(),
            high: (Number(price) + Math.random() * 10).toFixed(2),
            low: (Number(price) - Math.random() * 10).toFixed(2),
          };
          ws.send(JSON.stringify(msg));
        });
      };

     
      const interval = setInterval(sendMarketData, 2000);

     
      ws.on("close", () => {
        clearInterval(interval);
        console.log(`🔴 User disconnected: ${userId}`);
      });

      ws.on("error", (err) => {
        console.error("⚠️ WebSocket error:", err.message);
      });
    } catch (err) {
      console.error("❌ WebSocket connection error:", err.message);
      ws.close(1008, "Unauthorized or invalid token");
    }
  });
}
