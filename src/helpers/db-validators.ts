import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Esquemas Zod para validar parámetros
const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const stringSchema = z.string();
const emailSchema = z.string().email();

const findEmailClient = async (email = "") => {

    const validated = emailSchema.parse(email);
    const missingEmail = await prisma.usersClient.findFirst({ where: { email: validated } });
    if (missingEmail) {
        throw new Error('El email se encuentra registado');
    }
};

const findEmailDriver = async (email = "") => {

    const validated = emailSchema.parse(email);
    const missingEmail = await prisma.usersDriver.findFirst({ where: { email: validated } });
    if (missingEmail) {
        throw new Error('El email se encuentra registado');
    }
};

const findIdClient = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.usersClient.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdDriver = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.usersDriver.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdNotificationsClient = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.notificationsClient.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdNotificationsDriver = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.notificationsDriver.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdReportClient = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.reportClient.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
}

const findIdReportDriver = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.reportDriver.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
}

const findIdCommentDriver = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.commentsDriver.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
}

const findIdCommentClient = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.commentsClient.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
}

const findIdDiscountCode = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.discountCode.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
}

const findIdFavoritePlace = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.favoritePlace.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
}

const findScheduledTrip = async (id = "") => {

    const validated = emailSchema.parse(id);
    const missingId = await prisma.scheduledTrip.findFirst({ where: { uid: validated } });
    if (missingId) {
        throw new Error('El uid se encuentra registado');
    }
};

const findTrip = async (id = "") => {

    const validated = emailSchema.parse(id);
    const missingId = await prisma.trip.findFirst({ where: { uid: validated } });
    if (missingId) {
        throw new Error('El uid se encuentra registado');
    }
};

const findNotificationsDriver = async (id = "") => {

    const validated = emailSchema.parse(id);
    const missingId = await prisma.notificationsDriver.findFirst({ where: { uid: validated } });
    if (missingId) {
        throw new Error('El uid se encuentra registado');
    }
};

const findNotificationsClient = async (id = "") => {

    const validated = emailSchema.parse(id);
    const missingId = await prisma.notificationsClient.findFirst({ where: { uid: validated } });
    if (missingId) {
        throw new Error('El uid se encuentra registado');
    }
};

export {
    findIdReportClient,
    findIdReportDriver,
    findEmailClient,
    findIdClient,
    findIdNotificationsClient,
    findIdNotificationsDriver,
    findIdDriver,
    findEmailDriver,
    findIdCommentClient,
    findIdCommentDriver,
    findIdDiscountCode,
    findIdFavoritePlace,
    findScheduledTrip,
    findTrip,
    findNotificationsDriver,
    findNotificationsClient
}