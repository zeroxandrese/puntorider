import { PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redisConnection';
import { locationDriverProps } from '../interface/interface';
import { getSocketIO } from "../utils/initSocket";

import { orsCalculateDistance } from "../utils/orsDistance";

const prisma = new PrismaClient();

const io = getSocketIO();

const driverLocationPostService = async ({ uid, latitude, longitude }: locationDriverProps) => {
    try {
        const vehicleResponse = await prisma.usersDriver.findFirst({
            where: { uid }
        });

        if (!vehicleResponse) {
            throw new Error("No se encontró el conductor con ese UID");
        }

        const driverData = {
            latitude,
            longitude,
            vehicleType: vehicleResponse.vehicleType,
        };

        await redisClient.del(`positionDriver:${uid}`);
        await redisClient.set(`positionDriver:${uid}`, JSON.stringify(driverData), { EX: 300 });

        // Buscar viaje activo
        const activeTrip = await prisma.trip.findFirst({
            where: {
                usersDriverId: uid,
                status: true,
            },
            select: {
                usersClientId: true,
                latitudeStart: true,
                longitudeStart: true,
                tripStarted: true
            }
        });

        if (!activeTrip) {
            console.log(`🚫 No se encontró un viaje activo para el conductor ${uid}`);
            return;
        }

        const { distance, duration, polyline } = await orsCalculateDistance(
            activeTrip.latitudeStart,
            activeTrip.longitudeStart,
            driverData.latitude,
            driverData.longitude
        );

        const positionDriverEvent = {
            latitude: driverData.latitude,
            longitude: driverData.longitude
        };

        // Emitir según si el viaje ya fue iniciado o no
        const polylineType = activeTrip.tripStarted ? "FINAL" : "TEMP";

        io.to(activeTrip.usersClientId).emit("driver_route_accepted", {
            polyline,
            polylineType,
            positionDriverEvent
        });

        io.to(uid).emit("client_route_accepted", {
            polyline,
            polylineType,
            positionDriverEvent
        });


        console.log(`📡 Posición emitida a cliente ${activeTrip.usersClientId}`);
    } catch (err) {
        console.error(err);
        throw new Error("Error en el servicio del user");
    }
};

export { driverLocationPostService };