import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function useMarketData() {
  const { token } = useAuth();
  const [data, setData] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onclose = () => console.log("❌ WebSocket closed");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "price_update" && Array.isArray(msg.data)) {
          setData((prev) => {
            const next = { ...prev };
            msg.data.forEach((item) => {
              next[item.instrumentName] = item;
            });
            return next;
          });
        }
      } catch (err) {
        console.error("WS message error:", err);
      }
    };

    return () => ws.close();
  }, [token]);

  return { data };
}
