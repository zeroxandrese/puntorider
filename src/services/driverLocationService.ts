import { PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redisConnection';
import { locationDriverProps } from '../interface/interface';

const prisma = new PrismaClient();

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

    } catch (err) {
        console.error(err);
        throw new Error("Error en el servicio del user");
    }
};

export { driverLocationPostService };