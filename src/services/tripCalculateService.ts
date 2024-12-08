import { PrismaClient } from "@prisma/client";
import NodeGeocoder from "node-geocoder";

import { tripCalculateInterface } from '../interface/interface';
import { calculateDistance } from '../utils/calculateDistance';

const options: NodeGeocoder.Options = {
    provider: 'google',
    apiKey: process.env.key
}

const prisma = new PrismaClient();

const geocoder = NodeGeocoder(options)

const calculateEstimatedArrival = (distance: number, speedKmPerHour: number): Date => {
    const durationInHours = distance / speedKmPerHour; // Duración del viaje en horas
    const durationInMilliseconds = durationInHours * 60 * 60 * 1000;

    const currentDateTime = new Date();
    return new Date(currentDateTime.getTime() + durationInMilliseconds);
};

const tripCalculatePostService = async ({
    latitudeStart,
    longitudeStart,
    latitudeEnd,
    discountCode,
    longitudeEnd,
    paymentMethod,
    uid
}: tripCalculateInterface) => {

    const latitudeStartParse = parseFloat(latitudeStart);
    const longitudeStartParse = parseFloat(longitudeStart);
    const latitudeEndParse = parseFloat(latitudeEnd);
    const longitudeEndParse = parseFloat(longitudeEnd);
    // Validar y calcular la distancia del viaje
    const distance = calculateDistance(
        latitudeStartParse,
        longitudeStartParse,
        latitudeEndParse,
        longitudeEndParse
    );

    // Costo base por km
    const basePricePerKm = 0.6;
    let totalPrice = distance * basePricePerKm;

    const resAddressStart = await geocoder.reverse({ lat: latitudeStartParse, lon: longitudeStartParse });
    const resAddressEnd = await geocoder.reverse({ lat: latitudeEndParse, lon: longitudeEndParse });

    const currentDateTime = new Date();
    const currentHour = new Date().toISOString().slice(11, 16);

    // Calcular hora estimada de llegada
    const averageSpeedKmPerHour = 60; // Velocidad promedio
    const estimatedArrivalTime = calculateEstimatedArrival(distance, averageSpeedKmPerHour);
    const hourScheduledEnd = estimatedArrivalTime.toISOString().slice(11, 16);

    // Validacion discount code
    if (discountCode) {
        const responseDiscountCode = await prisma.discountCode.findFirst({
            where: { code: discountCode, usersClientId: uid },
        });

        if (!responseDiscountCode) {
            throw new Error("Código de descuento no válido");
        }

        // Aplicar descuento
        const discountPercentage = responseDiscountCode.percentage || 0;
        const discountAmount = (totalPrice * discountPercentage) / 100;
        totalPrice -= discountAmount;
    }

    const responseCalculeTrip = prisma.calculateTrip.create({
        data: {
            usersClientId: uid,
            price: totalPrice,
            basePrice: basePricePerKm,
            paymentMethod: paymentMethod,
            kilometers: distance,
            latitudeStart: latitudeStartParse,
            longitudeStart: longitudeStartParse,
            latitudeEnd: latitudeEndParse,
            longitudeEnd: longitudeEndParse,
            addressStart: resAddressStart[0].formattedAddress || "No disponible",
            addressEnd: resAddressEnd[0].formattedAddress || "No disponible",
            dateScheduled: currentDateTime,
            hourScheduledStart: currentHour,
            hourScheduledEnd: hourScheduledEnd,
            discountCode: discountCode || null,
            discountApplied: discountCode ? true : false
        }
    })

    return responseCalculeTrip
};

export { tripCalculatePostService };