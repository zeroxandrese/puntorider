import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Conectar Redis
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis connected successfully');
  }
};

export { redisClient, connectRedis };