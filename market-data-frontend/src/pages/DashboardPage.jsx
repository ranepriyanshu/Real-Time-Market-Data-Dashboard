

import React, { useState, useEffect } from "react";
import {
  subscribeInstrument,
  unsubscribeInstrument,
  getUserSubscriptions,
} from "../api/instruments";
import { useMarketData } from "../hooks/useMarketData";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./../index.css";

export default function DashboardPage() {
  const [instrument, setInstrument] = useState("");
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState([]);
  const { data, setData, connected } = useMarketData();
  const { logout } = useAuth();


  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getUserSubscriptions();
        setSubscribed(res.subscriptions || []);
      } catch (err) {
        console.error("Failed to fetch subscriptions", err);
      }
    };
    fetchSubscriptions();
  }, []);

  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!instrument.trim()) return;
    try {
      const symbol = instrument.trim().toUpperCase();
      const res = await subscribeInstrument(symbol);
      setSubscribed(res.subscriptions);
      setInstrument("");
      setError(null);
      toast.success(`Subscribed to ${symbol}`);
    } catch (err) {
      setError(err.response?.data?.error || "Subscription failed");
      toast.error("Subscription failed");
    }
  };


  const handleUnsubscribe = async (symbol) => {
    try {
      const res = await unsubscribeInstrument(symbol);
      setSubscribed(res.subscriptions);

      // Remove locally
      setData((prev) => {
        const updated = { ...prev };
        delete updated[symbol];
        return updated;
      });

      toast.success(`Unsubscribed from ${symbol}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to unsubscribe");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          📊 Real-Time Market Dashboard
          <span
            className={`h-3 w-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
            title={connected ? "Connected" : "Disconnected"}
          ></span>
        </h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>

      
      <form onSubmit={handleSubscribe} className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter instrument (e.g. AAPL)"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     placeholder-gray-500 min-w-[250px]"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md
                     text-white font-medium transition-all"
        >
          Subscribe
        </button>
      </form>

      {error && <div className="text-red-400 mb-3">{error}</div>}

      
      {subscribed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-400 mb-2 font-semibold">
            Subscribed Instruments:
          </h3>
          <div className="flex flex-wrap gap-2">
            {subscribed.map((symbol) => (
              <span
                key={symbol}
                className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {symbol}
                <button
                  onClick={() => handleUnsubscribe(symbol)}
                  className="text-red-400 hover:text-red-500 font-bold"
                  title="Unsubscribe"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      
      <div className="overflow-x-auto rounded-lg border border-gray-700 mt-4">
        <table className="min-w-full table-fixed text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="w-1/6 px-4 py-2 text-left">Instrument</th>
              <th className="w-1/6 px-4 py-2 text-left">Last Price</th>
              <th className="w-1/6 px-4 py-2 text-left">Quantity</th>
              <th className="w-1/6 px-4 py-2 text-left">Time</th>
              <th className="w-1/6 px-4 py-2 text-left">High</th>
              <th className="w-1/6 px-4 py-2 text-left">Low</th>
              <th className="w-1/6 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data).map((item) => (
              <Row
                key={item.instrumentName}
                item={item}
                onUnsubscribe={handleUnsubscribe}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ item, onUnsubscribe }) {
  const [prevPrice, setPrevPrice] = useState(item.lastTradedPrice);
  const [color, setColor] = useState("text-gray-300");

  if (item.lastTradedPrice !== prevPrice) {
    if (item.lastTradedPrice > prevPrice) setColor("text-green-400");
    else setColor("text-red-400");
    setPrevPrice(item.lastTradedPrice);
  }

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition">
      <td className="px-4 py-2 font-semibold">{item.instrumentName}</td>
      <td className={`px-4 py-2 font-medium ${color}`}>
        {item.lastTradedPrice}
      </td>
      <td className="px-4 py-2">{item.lastTradedQuantity}</td>
      <td className="px-4 py-2">
        {new Date(item.lastTradedDateTime).toLocaleTimeString()}
      </td>
      <td className="px-4 py-2 text-green-300">{item.high}</td>
      <td className="px-4 py-2 text-red-300">{item.low}</td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={() => onUnsubscribe(item.instrumentName)}
          className="text-red-400 hover:text-red-500 font-semibold text-lg"
          title="Unsubscribe"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
