import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export function useMarketData() {
  const { token } = useAuth();
  const [data, setData] = useState({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!token) return;


    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      setConnected(false);
    };

   
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

      
        if (msg.type === "market_data" && msg.instrumentName) {
          setData((prev) => ({
            ...prev,
            [msg.instrumentName]: msg,
          }));
        }

        
        if (msg.type === "connected") {
          console.log("📡 Server says:", msg.message);
        }
      } catch (error) {
        console.error("Invalid WS message:", event.data);
      }
    };

   
    return () => {
      ws.close();
    };
  }, [token]);

 
  return { data, setData, connected };
}
