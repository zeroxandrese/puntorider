import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const historyTripsDriverGetGetService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para buscar el historico de viaje.");
        }

       const historyTripsDriverResponseService = await prisma.historyTripsDriver.findMany({
        where: { uid: id }
        })

        return historyTripsDriverResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification client");
        
    }
};

export { historyTripsDriverGetGetService };