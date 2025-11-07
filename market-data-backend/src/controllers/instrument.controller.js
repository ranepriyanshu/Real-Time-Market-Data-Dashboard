import {
  addSubscription,
  getUserSubscriptions,
  removeSubscription,
} from "../data/subscriptions.js";


export async function subscribeToInstrument(req, res) {
  try {
    const userId = req.user?.id;
    const { instrument } = req.body;
    const redis = req.redis; 

    if (!instrument || typeof instrument !== "string") {
      return res.status(400).json({ error: "Instrument name is required" });
    }

    
    await addSubscription(redis, userId, instrument);
    const updatedList = await getUserSubscriptions(redis, userId);

    return res.status(200).json({
      message: `Subscribed to ${instrument}`,
      subscriptions: updatedList,
    });
  } catch (err) {
    console.error("Error subscribing to instrument:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


export async function unsubscribeFromInstrument(req, res) {
  try {
    const userId = req.user?.id;
    const { instrument } = req.body;
    const redis = req.redis; 

    if (!instrument || typeof instrument !== "string") {
      return res.status(400).json({ error: "Instrument name is required" });
    }


    const removed = await removeSubscription(redis, userId, instrument);
    if (!removed) {
      return res
        .status(404)
        .json({ error: `Instrument ${instrument} not found in your subscriptions` });
    }

    const updatedList = await getUserSubscriptions(redis, userId);

    return res.status(200).json({
      message: `Unsubscribed from ${instrument}`,
      subscriptions: updatedList,
    });
  } catch (err) {
    console.error("Error unsubscribing from instrument:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


export async function getSubscriptions(req, res) {
  try {
    const userId = req.user?.id;
    const redis = req.redis;

    const subscriptions = await getUserSubscriptions(redis, userId);
    return res.status(200).json({ subscriptions });
  } catch (err) {
    console.error("Error getting subscriptions:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
