import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const historyTripsDriverGetGetService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            console.error("El UID es obligatorio para buscar el historico de viaje.");
            return;
        }

        const historyTripsDriverResponseService = await prisma.historyTripsDriver.findMany({
            where: { usersDriverId: id }
        });

        if (historyTripsDriverResponseService.length === 0) {
            console.log("Sin viajes.");
            return;
        }

        return historyTripsDriverResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification client");

    }
};

export { historyTripsDriverGetGetService };