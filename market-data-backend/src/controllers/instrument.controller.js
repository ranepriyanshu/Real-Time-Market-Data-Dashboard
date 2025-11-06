import { addSubscription, getUserSubscriptions } from "../data/subscriptions.js";

/**
 * Handle user subscription to a new instrument
 */
export function subscribeToInstrument(req, res) {
  const userId = req.user?.id;
  const { instrument } = req.body;

  if (!instrument || typeof instrument !== "string") {
    return res.status(400).json({ error: "Instrument name is required" });
  }

  addSubscription(userId, instrument);

  const updatedList = getUserSubscriptions(userId);

  return res.status(200).json({
    message: `Subscribed to ${instrument}`,
    subscriptions: updatedList,
  });
}
