import { PrismaClient } from "@prisma/client";

import { commentsDriverProps, commentsClientsPutProps, commentsClientsDeleteProps, genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const commentDriverGetService = async ({ id }: genericIdProps) => {

    try {

       const commentResponseService = await prisma.commentsDriver.findMany({ where: { usersDriverId: id } });

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del lugar favorito");
        
    }
};

const commentDriverPostService = async ({ comment, usersDriverId, tripId }: commentsDriverProps) => {

    try {

       const commentResponseService = await prisma.commentsDriver.create({
            data: {
                comment,
                usersDriverId,
                tripId
            }
        })

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

const commentDriverPutService = async ({ comment, id }: commentsClientsPutProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

       const commentResponseService = await prisma.commentsDriver.update({
        where: { uid: id },
            data: {
                comment
            }
        })

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

const commentDriverDeleteService = async ({ id }: commentsClientsDeleteProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

       const commentResponseService = await prisma.commentsDriver.update({
        where: { uid: id },
            data: {
                status : false
            }
        })

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

export { commentDriverPostService, commentDriverPutService, commentDriverDeleteService, commentDriverGetService };