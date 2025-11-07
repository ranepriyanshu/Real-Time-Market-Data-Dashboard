
import { createClient } from "redis";

let redisClient;

export async function initRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`🔁 Redis reconnect attempt #${retries}`);
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on("error", (err) =>
      console.error("❌ Redis connection error:", err.message)
    );

    redisClient.on("connect", () =>
      console.log("✅ Redis connection established")
    );

    await redisClient.connect();
  }

  return redisClient;
}
