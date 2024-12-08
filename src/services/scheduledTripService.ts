import { PrismaClient } from "@prisma/client";

import { scheduledTripPutProps, genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const scheduledTripGetService = async ({ id }: genericIdProps) => {

    try {

       const scheduledTripResponseService = await prisma.scheduledTrip.findMany({ where: { usersClientId: id, status: true } });

        return scheduledTripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje programado");
        
    }
};

const scheduledTripPostService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para generar un viaje.");
        }

        const tripDataFind = await prisma.calculateTrip.findFirst({ where: { usersClientId: id, status: true } });

        if (!tripDataFind) {
            throw new Error("No se encontraron datos del viaje con el UID proporcionado.");
        }

        const scheduledTripResponseService = await prisma.scheduledTrip.create({
            data: {
                usersClientId: tripDataFind.usersClientId,
                price: tripDataFind.price,
                basePrice: tripDataFind.basePrice,
                paymentMethod: tripDataFind.paymentMethod,
                kilometers: tripDataFind.kilometers,
                latitudeStart: tripDataFind.latitudeStart,
                longitudeStart: tripDataFind.longitudeStart,
                latitudeEnd: tripDataFind.latitudeEnd,
                longitudeEnd: tripDataFind.longitudeEnd,
                addressStart: tripDataFind.addressStart,
                addressEnd: tripDataFind.addressEnd,
                dateScheduled: tripDataFind.dateScheduled,
                hourScheduledStart: tripDataFind.hourScheduledStart,
                hourScheduledEnd: tripDataFind.hourScheduledEnd,
                discountCode: tripDataFind.discountCode,
                discountApplied: tripDataFind.discountApplied
            }
        });

        // Actualizacion de la tabla intermedia de viaje
        await prisma.calculateTrip.update({ where: { uid: tripDataFind.uid }, data: { status: false } });

        return scheduledTripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje programado");
        
    }
};

const scheduledTripPutService = async ({ cancelForUser, id }: scheduledTripPutProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

       const scheduledTripResponseService = await prisma.scheduledTrip.update({
        where: { uid: id },
            data: {
                cancelForUser,
                status : false
            }
        })

        return scheduledTripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje programado");
        
    }
};

const scheduledTripDeleteService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

       const scheduledTripResponseService = await prisma.scheduledTrip.update({
        where: { uid: id },
            data: {
                status : false
            }
        })

        return scheduledTripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje programado");
        
    }
};

export { scheduledTripPostService, scheduledTripPutService, scheduledTripDeleteService, scheduledTripGetService };