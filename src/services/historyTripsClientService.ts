import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const historyTripsClientGetGetService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para buscar el historico de viaje.");
        }

       const historyTripsClientResponseService = await prisma.historyTripsClient.findMany({
        where: { uid: id }
        })

        return historyTripsClientResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification client");
        
    }
};

export { historyTripsClientGetGetService };