import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const notificationsClientPutService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un codigo.");
        }

       const notificationsClientResponseService = await prisma.notificationsClient.update({
        where: { uid: id },
            data: {
                status: false
            }
        })

        return notificationsClientResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification client");
        
    }
};

export { notificationsClientPutService };
