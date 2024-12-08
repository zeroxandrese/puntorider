import { PrismaClient } from "@prisma/client";

import { reportClientsPostProps } from '../interface/interface'

const prisma = new PrismaClient

const reportDriverService = async ({ comment, id }: reportClientsPostProps) => {

    try {

        if (!comment) {
            throw new Error("El comment es obligatorio para el reporte.");
        }

       const reportClientResponseService = await prisma.reportDriver.create({ 
        data: {
            usersDriverId: id,
            comment
        }
        });

        return reportClientResponseService

    } catch (err) {
        throw new Error("Error en el servicio del reporte");
        
    }
};

export { reportDriverService };