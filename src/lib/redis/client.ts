import "server-only";

import { createClient, type RedisClientType } from "redis";

import { env } from "@/config/env";

type RedisClient = RedisClientType;

const globalForRedis = globalThis as unknown as {
  client?: RedisClient;
  connectionPromise?: Promise<RedisClient>;
};

function getRedisClient(): RedisClient {
  if (globalForRedis.client) {
    return globalForRedis.client;
  }

  const client = createClient({ url: env.REDIS_URL });
  client.on("error", () => undefined);
  globalForRedis.client = client;
  return client;
}

export async function getConnectedRedisClient(): Promise<RedisClient> {
  const client = getRedisClient();
  if (client.isReady) {
    return client;
  }

  if (!globalForRedis.connectionPromise) {
    globalForRedis.connectionPromise = client.connect().then(() => client);
    globalForRedis.connectionPromise.catch(() => {
      globalForRedis.connectionPromise = undefined;
    });
  }

  return globalForRedis.connectionPromise;
}
