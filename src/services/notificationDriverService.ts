import { PrismaClient } from "@prisma/client";

import { genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const notificationsDriverPutService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un codigo.");
        }

       const notificationsClientResponseService = await prisma.notificationsDriver.update({
        where: { uid: id },
            data: {
                status: false
            }
        })

        return notificationsClientResponseService

    } catch (err) {
        throw new Error("Error en el servicio del notification driver");
        
    }
};

export { notificationsDriverPutService };