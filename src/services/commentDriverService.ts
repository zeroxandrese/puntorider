import { PrismaClient } from "@prisma/client";

import { getSocketIO } from "../utils/initSocket";
import { commentsDriverProps, commentsClientsPutProps, commentsClientsDeleteProps, genericIdProps } from '../interface/interface'

const io = getSocketIO();
const prisma = new PrismaClient

const commentDriverGetService = async ({ id }: genericIdProps) => {

    try {

        const commentClientResponseService = await prisma.commentsClient.findMany({ where: { tripId: id, status: true } });
        const commentDriverResponseService = await prisma.commentsDriver.findMany({ where: { tripId: id, status: true } });

        const commentResponseService = [...commentClientResponseService, ...commentDriverResponseService];

        commentResponseService.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

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
                usersId: usersDriverId,
                tripId
            }
        });
console.log(tripId, commentResponseService)
        io.to(tripId).emit('new-comment', commentResponseService);

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