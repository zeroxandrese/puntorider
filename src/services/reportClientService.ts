import { PrismaClient } from "@prisma/client";

import { reportClientsPostProps } from '../interface/interface'

const prisma = new PrismaClient

const reportClientService = async ({ comment, id }: reportClientsPostProps) => {

    try {
        if (!comment) {
            throw new Error("El comment es obligatorio para el reporte.");
        }

       const reportClientResponseService = await prisma.reportClient.create({ 
        data: {
            usersClientId: id,
            comment
        }
        });

        return reportClientResponseService

    } catch (err) {
        throw new Error("Error en el servicio del reporte");
        
    }
};

export { reportClientService };