export async function addSubscription(redis, userId, instrument) {
  await redis.sAdd(`user:${userId}:subscriptions`, instrument);
}

export async function removeSubscription(redis, userId, instrument) {
  return await redis.sRem(`user:${userId}:subscriptions`, instrument);
}

export async function getUserSubscriptions(redis, userId) {
  const subs = await redis.sMembers(`user:${userId}:subscriptions`);
  return subs || [];
}

export async function clearAllSubscriptions(redis) {
  const keys = await redis.keys("user:*:subscriptions");
  for (const key of keys) await redis.del(key);
  console.log("🧹 Cleared all user subscriptions");
}


