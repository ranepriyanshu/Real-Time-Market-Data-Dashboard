// src/utils/random.js

// In-memory store for simulated instruments
const marketData = new Map();

/**
 * Generates realistic market data for an instrument.
 * Includes: price, high, low, quantity, and timestamp.
 */
export function generateRandomPrice(instrumentName) {
  const prev = marketData.get(instrumentName) || {
    lastTradedPrice: Math.random() * 1000 + 100, // base price
    high: 0,
    low: Infinity,
  };

  // Random ±2% change
  const change = prev.lastTradedPrice * (Math.random() * 0.04 - 0.02);
  const newPrice = Math.max(1, prev.lastTradedPrice + change);

  // Random traded quantity (10–1000)
  const lastTradedQuantity = Math.floor(Math.random() * 991) + 10;

  // Update high/low
  const high = Math.max(prev.high, newPrice);
  const low = Math.min(prev.low, newPrice);

  // Create new object
  const updated = {
    instrumentName,
    lastTradedPrice: Number(newPrice.toFixed(2)),
    lastTradedQuantity,
    lastTradedDateTime: new Date().toISOString(),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
  };

  // Save for next iteration
  marketData.set(instrumentName, updated);
  return updated;
}
