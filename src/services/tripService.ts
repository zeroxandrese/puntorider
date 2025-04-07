import { PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redisConnection';

import { genericIdProps, tripPutProps, tripDeleteProps, userDriver, vehicle } from '../interface/interface';
import { calculateDistance } from '../utils/calculateDistance';

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

    console.log("🚗 Creando conductor temporal...");
    console.log("driverId:", driverId?.uid);
    console.log("Ubicación generada:", driverPosition);

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

        const driverId = await createTemporaryDriver(tripDataFind);
        const testDriver = await redisClient.get(`positionDriver:${driverId}`);

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
            return null;
        }

        // Calcular distancias con conductores
        const distances = await Promise.all(
            validPositions.map(async (driver) => {
                console.log("📍 Punto de inicio:", tripDataFind.latitudeStart, tripDataFind.longitudeStart);
                console.log("🚗 Ubicación del conductor:", driver.position.latitude, driver.position.longitude);
                const { distance, estimatedArrival } = await calculateDistance(
                    tripDataFind.latitudeStart,
                    tripDataFind.longitudeStart,
                    driver.position.latitude,
                    driver.position.longitude
                );
                console.log(`📏 Distancia con ${driver.userId}: ${distance} km`);
                return { driver: driver.userId, distance, estimatedArrival };
            })
        );

        // Filtrar conductores dentro del rango
        const reasonableDistance = 12; // en kilómetros
        const driversInRange = distances.filter(driver => driver.distance <= reasonableDistance);

        if (driversInRange.length === 0) {
            console.error("No hay conductores disponibles dentro de tu zona.");
            return null;
        }

        // Seleccionar el conductor más cercano
        const closestDriver = driversInRange.reduce((prev, current) => (prev.distance < current.distance ? prev : current));

        // Crear el viaje
        const tripResponseService = await prisma.trip.create({
            data: {
                usersClientId: tripDataFind.usersClientId,
                usersDriverId: closestDriver.driver,
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
                hourStart: tripDataFind.hourScheduledStart,
                estimatedArrival: tripDataFind.estimatedArrival,
                discountCode: tripDataFind.discountCode,
                discountApplied: tripDataFind.discountApplied
            }
        });

        // Actualización de la tabla intermedia de viaje
        await prisma.calculateTrip.update({
            where: { uid: tripDataFind.uid },
            data: { status: false }
        });
        console.log('antes')
        let driverData: userDriver | null = null;
        let vehicleData: vehicle | null = null;

        if (closestDriver.driver) {
            driverData = await prisma.usersDriver.findFirst({
                where: { uid: closestDriver.driver }
            })

            vehicleData = await prisma.vehicles.findFirst({
                where: { usersDriverId: closestDriver.driver }
            })
        }
        console.log(driverData,vehicleData )
        return {
            tripResponseService,
            arrivalInitial: closestDriver.estimatedArrival,
            driverData: driverData,
            vehicleData: vehicleData
        };

    } catch (err: any) {
        console.error("Error en el servicio del viaje:", err.message);
        return null;
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