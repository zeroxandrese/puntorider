import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const GetEarningsService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            console.error("El UID es obligatorio para buscar el historico de viaje.");
            return;
        }

        const earningsResponseService = await prisma.weeklyDriverEarnings.findFirst({
            where: { usersDriverId: id }
        });

        if (!earningsResponseService) {
            console.log("Sin ganancias.");
            return;
        }

        return earningsResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification client");

    }
};

export { GetEarningsService };