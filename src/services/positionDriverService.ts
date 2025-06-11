import { redisClient } from '../config/redisConnection';
import { getSocketIO } from "../utils/initSocket";
import { PrismaClient } from "@prisma/client";

import { positionDriverProps, genericIdProps } from '../interface/interface';

const io = getSocketIO();

const prisma = new PrismaClient

const positionDriverGetService = async () => {

  const keys = await redisClient.keys('positionDriver:*');

  // Recuperar las posiciones
  const positions = await Promise.all(
    keys.map(async (key) => {
      const data = await redisClient.get(key);
      return { userId: key.replace('positionDriver:', ''), position: JSON.parse(data || '{}') };
    })
  );

  return positions;
};

const positionDriverPostService = async ({ latitude, longitude, usersDriverId }: positionDriverProps) => {

  const key = `positionDriver:${usersDriverId}`;
  const data = { latitude, longitude, usersDriverId };

  const response = await redisClient.set(key, JSON.stringify(data), {
    EX: 10
  });

  if (!response) return { message: 'No position data found for this user' };

  // Buscar viaje activo de este conductor
  const activeTrip = await prisma.trip.findFirst({
    where: {
      usersDriverId,
      status: true,
    },
    select: {
      usersClientId: true,
    }
  });

  if (!activeTrip) {
    console.log(`🚫 No se encontró un viaje activo para el conductor ${usersDriverId}`);
    return response;
  }

  const payload = { position: { latitude, longitude } };

  // Emitir posición al cliente con viaje activo
  io.to(activeTrip.usersClientId).emit("driver_position_update", payload);
  console.log(`📡 Posición emitida a cliente ${activeTrip.usersClientId}`);

  return response;

};

const positionDriverDeleteService = async ({ id }: genericIdProps) => {

  const key = `positionDriver:${id}`;
  const deleted = await redisClient.del(key);

  if (deleted) {
    return { message: `Position data with ID ${id} deleted successfully` };
  }
  return { message: `No position data found with ID ${id}` };

};

export { positionDriverPostService, positionDriverDeleteService, positionDriverGetService };
