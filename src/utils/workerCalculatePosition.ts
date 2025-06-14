import { Worker } from 'bullmq';
import { getSocketIO } from "../utils/initSocket";
import { orsCalculateDistance } from "../utils/orsDistance";

const io = getSocketIO();

/* const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +(process.env.REDIS_PORT || 6379),
}; */

// Definimos el processor como arrow function
const processRoute = async (job: { data: any }) => {
  const { uid, start, end, clientId, tripStarted } = job.data;
  const { distance, duration, polyline } = await orsCalculateDistance(
    start[0], start[1], end[0], end[1]
  );

  const payload = {
    polyline,
    polylineType: tripStarted ? 'FINAL' : 'TEMP',
    positionDriverEvent: { latitude: end[0], longitude: end[1] }
  };

  io.to(clientId).emit('driver_route_accepted', payload);
  io.to(uid).emit('client_route_accepted', payload);
  console.log(`📡 Ruta emitida a ${clientId}`);
};

/* export const routeWorker = new Worker(
  'calculate-route',
  processRoute,
  { connection: redisConnection }
); */