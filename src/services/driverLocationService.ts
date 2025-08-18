import { PrismaClient } from "@prisma/client";
import { redisClient, connectRedis } from "../config/redisConnection";
import { locationDriverProps } from "../interface/interface";
import { getSocketIO } from "../utils/initSocket";
import { orsCalculateDistance } from "../utils/orsDistance";

const prisma = new PrismaClient();
const io = getSocketIO();

const driverLocationPostService = async (
  { uid, latitude, longitude }: locationDriverProps
): Promise<void> => {
  try {
    // Asegurarnos de que Redis está conectado
    if (!redisClient.isOpen) {
      await connectRedis();
    }

    // 1) Obtener vehicleType
    const vehicleResponse = await prisma.usersDriver.findFirst({
      where: { uid },
      select: { vehicleType: true }
    });
    if (!vehicleResponse) {
      throw new Error("No se encontró el conductor con ese UID");
    }

    // 2) Preparar datos del driver
    const driverData = {
      latitude,
      longitude,
      vehicleType: vehicleResponse.vehicleType,
    };

    // 3) Guardar posición del driver en Redis (expira en 5 min)
    await redisClient.set(
      `positionDriver:${uid}`,
      JSON.stringify(driverData),
      { EX: 300 }
    );

    // 4) Buscar viaje activo en la base de datos
    const activeTrip = await prisma.trip.findFirst({
      where: {
        usersDriverId: uid,
        status: true,
      },
      select: {
        usersClientId: true,
        latitudeStart: true,
        longitudeStart: true,
        tripStarted: true,
      },
    });
    if (!activeTrip) {
      console.log(`🚫 No hay viaje activo para el conductor ${uid}`);
      return;
    }

    // 5) Calcular ruta con ORS
    const { polyline } = await orsCalculateDistance(
      activeTrip.latitudeStart,
      activeTrip.longitudeStart,
      latitude,
      longitude
    );

    // 6) Emitir evento por Socket.IO
    const payload = {
      polyline,
      polylineType: activeTrip.tripStarted ? "FINAL" : "TEMP",
      positionDriverEvent: { latitude, longitude },
    };
    io.to(activeTrip.usersClientId).emit("driver_position_update", payload);
    io.to(uid).emit("client_route_accepted", payload);

    console.log(`📡 Posición emitida a cliente ${activeTrip.usersClientId}`);
  } catch (err) {
    console.error("driverLocationPostService:", err);
    throw new Error("Error en el servicio de posicionamiento");
  }
};

export { driverLocationPostService };