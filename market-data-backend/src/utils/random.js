
const marketData = new Map();


export function generateRandomPrice(instrumentName) {
  const prev = marketData.get(instrumentName) || {
    lastTradedPrice: Math.random() * 1000 + 100, // base price
    high: 0,
    low: Infinity,
  };

 
  const change = prev.lastTradedPrice * (Math.random() * 0.04 - 0.02);
  const newPrice = Math.max(1, prev.lastTradedPrice + change);

 
  const lastTradedQuantity = Math.floor(Math.random() * 991) + 10;


  const high = Math.max(prev.high, newPrice);
  const low = Math.min(prev.low, newPrice);

 
  const updated = {
    instrumentName,
    lastTradedPrice: Number(newPrice.toFixed(2)),
    lastTradedQuantity,
    lastTradedDateTime: new Date().toISOString(),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
  };


  marketData.set(instrumentName, updated);
  return updated;
}
