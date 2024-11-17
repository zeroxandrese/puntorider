import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Esquemas Zod para validar parámetros
const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const stringSchema = z.string();
const emailSchema = z.string().email();

const findEmail = async (email = "") => {

    const validated = emailSchema.parse(email);
    const missingEmail = await prisma.user.findUnique({ where: { email: validated } });
    if (missingEmail) {
        throw new Error('El email se encuentra registado');
    }
};

const findId = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.user.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdNotifications = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.notifications.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdReportClient = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.report.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del reporte no se encuentra registrado');
    }
}

const findIdReportDriver = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.report.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del reporte no se encuentra registrado');
    }
}

export {
    findIdReportClient,
    findIdReportDriver,
    findEmail,
    findId,
    findIdNotifications
}