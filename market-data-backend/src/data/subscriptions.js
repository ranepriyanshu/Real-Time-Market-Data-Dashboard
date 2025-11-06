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
