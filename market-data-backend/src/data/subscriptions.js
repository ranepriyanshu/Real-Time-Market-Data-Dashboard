/**
 * Temporary in-memory storage for user subscriptions.
 * Structure: Map<userId, Set<instrumentName>>
 */
export const userSubscriptions = new Map();

/**
 * Subscribe a user to an instrument.
 */
export function addSubscription(userId, instrumentName) {
  if (!userSubscriptions.has(userId)) {
    userSubscriptions.set(userId, new Set());
  }
  userSubscriptions.get(userId).add(instrumentName);
}

/**
 * Get all subscriptions for a user.
 */
export function getUserSubscriptions(userId) {
  return Array.from(userSubscriptions.get(userId) || []);
}


export function removeSubscription(userId, instrument) {
  if (!userSubscriptions.has(userId)) {
    return false;
  }
  const subs = userSubscriptions.get(userId);
  const existed = subs.delete(instrument);
  if (subs.size === 0) {
    userSubscriptions.delete(userId); // clean up empty users
  }
  return existed;
}
