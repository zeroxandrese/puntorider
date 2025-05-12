import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const historyTripsDriverGetGetService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            console.error("El UID es obligatorio para buscar el historico de viaje.");
            return;
        }
console.log(id, 'desde el service')
       const historyTripsDriverResponseService = await prisma.historyTripsDriver.findMany({
        where: { usersDriverId: id }
        })
console.log(historyTripsDriverResponseService)
        return historyTripsDriverResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification client");
        
    }
};

export { historyTripsDriverGetGetService };