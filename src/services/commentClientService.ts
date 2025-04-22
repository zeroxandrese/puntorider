import { PrismaClient } from "@prisma/client";

import { getSocketIO } from "../utils/initSocket";
import { commentsClientsProps, commentsClientsPutProps, commentsClientsDeleteProps, genericIdProps } from '../interface/interface'

const io = getSocketIO();
const prisma = new PrismaClient

const commentClientGetService = async ({ id }: genericIdProps) => {

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

const commentClientPostService = async ({ comment, usersClientId, tripId }: commentsClientsProps) => {

    try {

        const commentResponseService = await prisma.commentsClient.create({
            data: {
                comment,
                usersId: usersClientId,
                tripId
            }
        });

        io.to(tripId).emit('new-comment', comment);

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
                status: false
            }
        })

        return commentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

export { commentClientPostService, commentClientPutService, commentClientDeleteService, commentClientGetService };