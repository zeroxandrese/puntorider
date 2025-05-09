import { redisClient } from '../config/redisConnection';

export const clearAllRedisKeys = async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  
    for await (const key of redisClient.scanIterator()) {
      await redisClient.del(key);
    }
  
    console.log("✅ Todas las claves han sido eliminadas.");
  };