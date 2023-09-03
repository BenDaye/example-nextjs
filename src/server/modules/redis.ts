import { Redis } from 'ioredis';
import { env } from './env';

const redisGlobal = global as typeof global & {
  redis?: Redis;
};

export const redis: Redis =
  redisGlobal.redis ||
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

if (env.NODE_ENV !== 'production') {
  redisGlobal.redis = redis;
}
