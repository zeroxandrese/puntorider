import { PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redisConnection';
import { getSocketIO } from "../utils/initSocket";

import { genericIdProps, tripPutProps, tripDeleteProps, userDriver, vehicle } from '../interface/interface';
import { calculateDistance } from '../utils/calculateDistance';

const io = getSocketIO();

const prisma = new PrismaClient

const createTemporaryDriver = async (tripDataFind: any) => {
    if (!tripDataFind) {
        throw new Error("No se encontraron datos del viaje.");
    }

    const driverId = await prisma.usersDriver.findFirst({
        where: { status: true }
    });

    if (!driverId) {
        console.error("sin driveruserr")
        return null
    }

    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;

    const driverPosition = {
        latitude: tripDataFind.latitudeStart + latOffset,
        longitude: tripDataFind.longitudeStart + lngOffset,
    };

    try {
        // Verificar conexión con Redis
        if (!redisClient.isOpen) {
            console.log("🔄 Redis desconectado, reconectando...");
            await redisClient.connect();
        }
        await redisClient.del("positionDriver:[object Object]");
        // Guardar en Redis
        await redisClient.set(`positionDriver:${driverId.uid}`, JSON.stringify(driverPosition), {
            EX: 300
        });

        console.log("✅ Conductor guardado en Redis correctamente.");
    } catch (error) {
        console.error("❌ Error al guardar en Redis:", error);
    }

    return driverId;
};

const tripGetService = async ({ id }: genericIdProps) => {

    try {

        const scheduledTripResponseService = await prisma.scheduledTrip.findMany({ where: { usersClientId: id, status: true } });

        return scheduledTripResponseService

    } catch (err) {
        throw new Error("Error en el servicio del viaje programado");

    }
};

const tripPostService = async ({ id }: genericIdProps) => {
    try {
        if (!id) {
            console.error("El UID es obligatorio para generar un viaje.");
            return null;
        }

        const tripDataFind = await prisma.calculateTrip.findFirst({ where: { usersClientId: id, status: true } });

        if (!tripDataFind) {
            console.error("No se encontraron datos del viaje con el UID proporcionado.");
            return null;
        }

        await createTemporaryDriver(tripDataFind);

        // Obtener conductores disponibles
        const keys = await redisClient.keys('positionDriver:*');
        if (keys.length === 0) {
            console.error("No hay conductores disponibles cerca.");
            return null;
        }

        // Procesar conductores y calcular distancias
        const positions = await Promise.all(
            keys.map(async (key) => {
                try {
                    const data = await redisClient.get(key);
                    if (!data) return null;
                    const parsedData = JSON.parse(data);
                    return { userId: key.replace('positionDriver:', ''), position: parsedData };
                } catch (error) {
                    console.error(`❌ Error al parsear datos de Redis para ${key}:`, error);
                    return null;
                }
            })
        );

        const validPositions = positions.filter((p) => p !== null) as { userId: string; position: { latitude: number; longitude: number } }[];


        if (validPositions.length === 0) {
            console.error("No hay conductores disponibles en la zona.");
            return {
                tripId: "",
                message: "No hay conductores disponibles dentro de tu zona."
            };
        }

        // Calcular distancias con conductores
        const distances = await Promise.all(
            validPositions.map(async (driver) => {

                const { distance, estimatedArrival } = await calculateDistance(
                    tripDataFind.latitudeStart,
                    tripDataFind.longitudeStart,
                    driver.position.latitude,
                    driver.position.longitude
                );

                return { driver: driver.userId, distance, estimatedArrival };
            })
        );

        // Filtrar conductores dentro del rango
        const reasonableDistance = 12; // en kilómetros
        const driversInRange = distances.filter(driver => driver.distance <= reasonableDistance);

        console.log("✅ Conductores dentro del rango:", driversInRange);
        if (driversInRange.length === 0) {
            console.error("No hay conductores disponibles dentro de tu zona.");
            return {
                tripId: "",
                message: "No hay conductores disponibles dentro de tu zona."
            };
        }

        // Guardar lista de conductores potenciales para el viaje
        await redisClient.set(`pendingTrip:${tripDataFind.uid}`, JSON.stringify(driversInRange.map(d => d.driver)));

        //Emisiòn de notificacion a los conductores
        driversInRange.forEach((driver) => {
            io.to(driver.driver).emit("new_trip_request", {
                tripId: tripDataFind.uid,
                origin: {
                    lat: tripDataFind.latitudeStart,
                    lng: tripDataFind.longitudeStart,
                    address: tripDataFind.addressStart,
                },
                destination: {
                    lat: tripDataFind.latitudeEnd,
                    lng: tripDataFind.longitudeEnd,
                    address: tripDataFind.addressEnd,
                },
                price: tripDataFind.price,
                estimatedArrival: driver.estimatedArrival,
            });
        });

        return {
            tripId: tripDataFind.uid,
            message: "Solicitud de viaje enviada a conductores cercanos.",
        };

    } catch (err: any) {
        console.error("Error en el servicio del viaje:", err.message);
        return null;
    }
};

const tripAcceptService = async ({ driverId, tripId }: { driverId: string; tripId: string }) => {
    try {
        const pendingDriversStr = await redisClient.get(`pendingTrip:${tripId}`);
        const pendingDrivers: string[] = pendingDriversStr ? JSON.parse(pendingDriversStr) : [];

        const cleanDriverId = String(driverId).trim();

        if (!pendingDrivers.includes(cleanDriverId)) {
            return { success: false, message: "Este conductor no puede aceptar este viaje." };
        }

        // Eliminar la key para evitar que otros acepten
        await redisClient.del(`pendingTrip:${tripId}`);

        // Buscar los datos del viaje
        const tripDataFind = await prisma.calculateTrip.findUnique({ where: { uid: tripId, status: true } });
        if (!tripDataFind) return { success: false, message: "El viaje no existe." };

        if (tripDataFind.discountCode) {
            const discount = await prisma.discountCode.findFirst({
                where: {
                    usersClientId: tripDataFind.usersClientId,
                    code: tripDataFind.discountCode,
                    status: true
                },
            });

            if (discount) {
                await prisma.discountCode.update({
                    where: { uid: discount.uid },
                    data: { status: false },
                });
            }
        };

        const trip = await prisma.trip.create({
            data: {
                usersClientId: tripDataFind.usersClientId,
                usersDriverId: driverId,
                price: tripDataFind.price,
                priceWithDiscount: tripDataFind.priceWithDiscount,
                basePrice: tripDataFind.basePrice,
                paymentMethod: tripDataFind.paymentMethod,
                kilometers: tripDataFind.kilometers,
                latitudeStart: tripDataFind.latitudeStart,
                longitudeStart: tripDataFind.longitudeStart,
                latitudeEnd: tripDataFind.latitudeEnd,
                longitudeEnd: tripDataFind.longitudeEnd,
                addressStart: tripDataFind.addressStart,
                addressEnd: tripDataFind.addressEnd,
                hourStart: tripDataFind.hourScheduledStart,
                estimatedArrival: tripDataFind.estimatedArrival,
                discountCode: tripDataFind.discountCode,
                discountApplied: tripDataFind.discountApplied
            }
        });

        await prisma.calculateTrip.update({
            where: { uid: tripId },
            data: { status: false }
        });

        // Notificaciones
        const driverData = await prisma.usersDriver.findFirst({ where: { uid: driverId } });
        const vehicleData = await prisma.vehicles.findFirst({ where: { usersDriverId: driverId } });

        io.to(tripDataFind.usersClientId).emit("trip_accepted", {
            trip,
            driver: driverData,
            vehicle: vehicleData,
        });

        io.to(driverId).emit("trip_assigned", {
            trip,
        });

        return { success: true, trip };

    } catch (err: any) {
        console.error("Error al aceptar el viaje:", err.message);
        return { success: false, message: "Error interno." };
    }
};

const tripDriverArrivedService = async ({ driverId, tripId }: { driverId: string; tripId: string }) => {
    try {

        const tripDataFind = await prisma.trip.findUnique({ where: { uid: tripId, usersDriverId: driverId, status: true } });
        if (!tripDataFind) return { success: false, message: "El viaje no existe." };

        const trip = await prisma.trip.update({
            where: { uid: tripId, usersDriverId: driverId, status: true },
            data: {
                driverArrived: true
            }
        });

        io.to(tripDataFind.usersClientId).emit("trip_driverArrived", {
            trip
        });

        io.to(driverId).emit("trip_driverArrived", {
            trip,
        });

        return { success: true, trip };

    } catch (err: any) {
        console.error("Error al aceptar el viaje:", err.message);
        return { success: false, message: "Error interno." };
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

export {
    tripPostService, tripPutService,
    tripDeleteService, tripGetService,
    tripAcceptService, tripDriverArrivedService
};