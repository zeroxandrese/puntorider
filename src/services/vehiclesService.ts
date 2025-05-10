import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const vehiclesGetService = async ({ id }: genericIdProps) => {

    try {

        const vehiclesValidation = await prisma.vehicles.findFirst({
            where: { usersDriverId: id, status: true }
        })

        return vehiclesValidation

    } catch (err) {
        throw new Error("Error en el servicio del lugar favorito");

    }
};

export { vehiclesGetService };
