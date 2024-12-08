import { PrismaClient } from "@prisma/client";

import { discountCodePostProps, commentsClientsDeleteProps } from '../interface/interface'

const prisma = new PrismaClient

interface discountCodePutProps extends discountCodePostProps {
    id: string
}

const discountCodeGetService = async ({ id }: commentsClientsDeleteProps) => {

    try {

       const discountCodeResponseService = await prisma.discountCode.findMany({
        where: { usersClientId: id }
        })

        return discountCodeResponseService

    } catch (err) {
        throw new Error("Error en el servicio del codigo");
        
    }
};

const discountCodePostService = async ({ percentage, usersClientId, code }: discountCodePostProps) => {

    try {

       const discountCodeResponseService = await prisma.discountCode.create({
            data: {
                usersClientId,
                code,
                percentage
            }
        })

        return discountCodeResponseService

    } catch (err) {
        throw new Error("Error en el servicio del code");
        
    }
};

const discountCodePutService = async ({ code, usersClientId, percentage, id }: discountCodePutProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un codigo.");
        }

       const discountCodeResponseService = await prisma.discountCode.update({
        where: { uid: id },
            data: {
                code,
                usersClientId,
                percentage
            }
        })

        return discountCodeResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

const discountCodeDeleteService = async ({ id }: commentsClientsDeleteProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un codigo.");
        }

       const discountCodeResponseService = await prisma.discountCode.update({
        where: { uid: id },
            data: {
                status : false
            }
        })

        return discountCodeResponseService

    } catch (err) {
        throw new Error("Error en el servicio del code");
        
    }
};

export { discountCodePostService, discountCodePutService, discountCodeDeleteService, discountCodeGetService };