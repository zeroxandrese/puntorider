import { PrismaClient } from "@prisma/client";

import { commentsClientsProps, commentsClientsPutProps, commentsClientsDeleteProps, genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const commentClientGetService = async ({ id }: genericIdProps) => {

    try {

       const commentResponseService = await prisma.commentsClient.findMany({ where: { usersClientId: id } });

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del lugar favorito");
        
    }
};

const commentClientPostService = async ({ comment, usersClientId, tripId }: commentsClientsProps) => {

    try {

       const commentResponseService = await prisma.commentsClient.create({
            data: {
                comment,
                usersClientId,
                tripId
            }
        })

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

const commentClientPutService = async ({ comment, id }: commentsClientsPutProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

       const commentResponseService = await prisma.commentsClient.update({
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

const commentClientDeleteService = async ({ id }: commentsClientsDeleteProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

       const commentResponseService = await prisma.commentsClient.update({
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

export { commentClientPostService, commentClientPutService, commentClientDeleteService, commentClientGetService };