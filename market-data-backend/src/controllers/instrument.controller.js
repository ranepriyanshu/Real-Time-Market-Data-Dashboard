// import { addSubscription, getUserSubscriptions } from "../data/subscriptions.js";

// /**
//  * Handle user subscription to a new instrument
//  */
// export function subscribeToInstrument(req, res) {
//   const userId = req.user?.id;
//   const { instrument } = req.body;

//   if (!instrument || typeof instrument !== "string") {
//     return res.status(400).json({ error: "Instrument name is required" });
//   }

//   addSubscription(userId, instrument);

//   const updatedList = getUserSubscriptions(userId);

//   return res.status(200).json({
//     message: `Subscribed to ${instrument}`,
//     subscriptions: updatedList,
//   });
// }


import { addSubscription, getUserSubscriptions, removeSubscription } from "../data/subscriptions.js";

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

/**
 * Handle user unsubscription from an instrument
 */
export function unsubscribeFromInstrument(req, res) {
  const userId = req.user?.id;
  const { instrument } = req.body;

  if (!instrument || typeof instrument !== "string") {
    return res.status(400).json({ error: "Instrument name is required" });
  }

  const removed = removeSubscription(userId, instrument);

  if (!removed) {
    return res.status(404).json({ error: `Instrument ${instrument} not found in your subscriptions` });
  }

  const updatedList = getUserSubscriptions(userId);

  return res.status(200).json({
    message: `Unsubscribed from ${instrument}`,
    subscriptions: updatedList,
  });
}

