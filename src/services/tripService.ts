import { PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redisConnection';

import { genericIdProps, tripPutProps, tripDeleteProps } from '../interface/interface';
import { calculateDistance } from '../utils/calculateDistance';

const prisma = new PrismaClient

const tripGetService = async ({ id }: genericIdProps) => {

    try {

        const scheduledTripResponseService = await prisma.scheduledTrip.findMany({ where: { usersClientId: id, status: true } });

        return scheduledTripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje programado");

    }
};

const tripPostService = async ({
    id
}: genericIdProps) => {
    try {

        if (!id) {
            console.error("El UID es obligatorio para generar un viaje.");
        }

        const tripDataFind = await prisma.calculateTrip.findFirst({ where: { usersClientId: id, status: true } });

        if (!tripDataFind) {
            console.error("No se encontraron datos del viaje con el UID proporcionado.");
        }

        const keys = await redisClient.keys('positionDriver:*');
        const positions = await Promise.all(
            keys.map(async (key) => {
                const data = await redisClient.get(key);
                return { userId: key.replace('positionDriver:', ''), position: JSON.parse(data || '{}') };
            })
        );

        // Verificar si hay conductores disponibles
        if (positions.length === 0) {
            console.error("No hay conductores disponibles cerca.");
        }

        // Calcular las distancias con los conductores
        const distances = await Promise.all(
            positions.map(async (driver) => {
                const { distance } = await calculateDistance(
                    tripDataFind!.latitudeStart,
                    tripDataFind!.longitudeStart,
                    driver.position.latitude,
                    driver.position.longitude
                );
                return { driver: driver.userId, distance };
            })
        );

        //  Conductores dentro del rango
        const reasonableDistance = 12; // en kilómetros
        const driversInRange = distances.filter(driver => driver.distance <= reasonableDistance);

        if (driversInRange.length === 0) {
            throw new Error("No hay conductores disponibles dentro de tu zona.");
        }

        // Driver mas cercano
        const closestDriver = distances.reduce((prev, current) => (prev.distance < current.distance ? prev : current));

        const tripResponseService = await prisma.trip.create({
            data: {
                usersClientId: tripDataFind!.usersClientId,
                usersDriverId: closestDriver.driver,
                price: tripDataFind!.price,
                basePrice: tripDataFind!.basePrice,
                paymentMethod: tripDataFind!.paymentMethod,
                kilometers: tripDataFind!.kilometers,
                latitudeStart: tripDataFind!.latitudeStart,
                longitudeStart: tripDataFind!.longitudeStart,
                latitudeEnd: tripDataFind!.latitudeEnd,
                longitudeEnd: tripDataFind!.longitudeEnd,
                addressStart: tripDataFind!.addressStart,
                addressEnd: tripDataFind!.addressEnd,
                hourStart: tripDataFind!.hourScheduledStart,
                estimatedArrival: tripDataFind!.estimatedArrival,
                discountCode: tripDataFind!.discountCode,
                discountApplied: tripDataFind!.discountApplied
            }
        });

        // Actualizacion de la tabla intermedia de viaje
        prisma.calculateTrip.update({ where: { uid: tripDataFind!.uid }, data: { status: false } });

        return tripResponseService;
    } catch (err) {
        throw new Error("Error en el servicio del viaje");
    }
};

const tripPutService = async ({ complete, paid, cancelForUser, id }: tripPutProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para generar un viaje.");
        }

        const existingTrip = await prisma.trip.findUnique({
            where: { uid: id },
        });

        if (!existingTrip) {
            throw new Error("El viaje no existe.");
        }

        const tripResponseService = await prisma.$transaction(async (prisma) => {

            const updatedTrip = await prisma.trip.update({
                where: { uid: id },
                data: {
                    complete,
                    paid,
                    cancelForUser
                }
            });

            if (complete) {

                await prisma.historyTripsClient.create({
                    data: {
                        usersClientId: updatedTrip.usersClientId,
                        tripId: updatedTrip.uid,
                        price: updatedTrip.price,
                        basePrice: updatedTrip.basePrice,
                        paymentMethod: updatedTrip.paymentMethod,
                        kilometers: updatedTrip.kilometers,
                        latitudeStart: updatedTrip.latitudeStart,
                        longitudeStart: updatedTrip.longitudeStart,
                        latitudeEnd: updatedTrip.latitudeEnd,
                        longitudeEnd: updatedTrip.longitudeEnd,
                        addressStart: updatedTrip.addressStart,
                        addressEnd: updatedTrip.addressEnd,
                        hourStart: updatedTrip.hourStart,
                        hourEnd: new Date().toString(),
                        discountCode: updatedTrip.discountCode,
                        discountApplied: updatedTrip.discountApplied
                    }
                });

                await prisma.historyTripsDriver.create({
                    data: {
                        usersDriverId: updatedTrip.usersDriverId,
                        tripId: updatedTrip.uid,
                        price: updatedTrip.price,
                        basePrice: updatedTrip.basePrice,
                        paymentMethod: updatedTrip.paymentMethod,
                        kilometers: updatedTrip.kilometers,
                        latitudeStart: updatedTrip.latitudeStart,
                        longitudeStart: updatedTrip.longitudeStart,
                        latitudeEnd: updatedTrip.latitudeEnd,
                        longitudeEnd: updatedTrip.longitudeEnd,
                        addressStart: updatedTrip.addressStart,
                        addressEnd: updatedTrip.addressEnd,
                        hourStart: updatedTrip.hourStart,
                        hourEnd: new Date().toString(),
                        discountCode: updatedTrip.discountCode,
                        discountApplied: updatedTrip.discountApplied
                    }
                });

                return updatedTrip;
            }
        });

        return tripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje");

    }
};

const tripDeleteService = async ({ id }: tripDeleteProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un trip.");
        }

        const tripResponseService = await prisma.trip.update({
            where: { uid: id },
            data: {
                status: false
            }
        })

        return tripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje");

    }
};

export { tripPostService, tripPutService, tripDeleteService, tripGetService };