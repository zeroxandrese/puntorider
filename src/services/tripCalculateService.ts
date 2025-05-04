import { PrismaClient } from "@prisma/client";
import NodeGeocoder from "node-geocoder";

import { tripCalculateInterface, PropsPutCalculateTripOfferedPrice, PropsDeleteCalculateTrip } from '../interface/interface';
import { calculateDistance } from '../utils/calculateDistance';

const options: NodeGeocoder.Options = {
    provider: 'google',
    apiKey: process.env.key
}

const prisma = new PrismaClient();

const geocoder = NodeGeocoder(options);

const haversineDistance = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Funcion para redondear el precio del trip
const roundToNextHalfOrWhole = (value: number) => Math.ceil(value * 2) / 2;

const tripCalculatePostService = async ({
    latitudeStart,
    longitudeStart,
    latitudeEnd,
    discountCode,
    discountApplied,
    longitudeEnd,
    paymentMethod,
    vehicle,
    uid
}: tripCalculateInterface) => {

    const latitudeStartParse = parseFloat(latitudeStart);
    const longitudeStartParse = parseFloat(longitudeStart);
    const latitudeEndParse = parseFloat(latitudeEnd);
    const longitudeEndParse = parseFloat(longitudeEnd);

    const estimatedDistance = haversineDistance(
        latitudeStartParse,
        longitudeStartParse,
        latitudeEndParse,
        longitudeEndParse
    );

    // límite de 100 km
    const MAX_DISTANCE_KM = 100;

    if (estimatedDistance > MAX_DISTANCE_KM) {
        console.warn(`Distancia estimada muy grande: ${estimatedDistance.toFixed(2)} km`);
        return {
            message: `La distancia entre los puntos seleccionados excede el límite permitido de ${MAX_DISTANCE_KM} km.`,
            valid: false
        };
    }

    // Validar y calcular la distancia del viaje
    const distance = await calculateDistance(
        latitudeStartParse,
        longitudeStartParse,
        latitudeEndParse,
        longitudeEndParse
    );

    const basePricePerKmBase = await prisma.priceBaseTrip.findFirst({
        where: { status: true }
    })

    if (!basePricePerKmBase) {
        console.error("Sin precio base, no se puede continuar");
        throw new Error("No se encontró un precio base activo.");
    }

    let totalPriceOriginla = distance.distance * basePricePerKmBase?.price!;
    totalPriceOriginla = roundToNextHalfOrWhole(totalPriceOriginla);

    let finalPriceWithDiscount = totalPriceOriginla;

    if (discountCode) {
        const responseDiscountCode = await prisma.discountCode.findFirst({
            where: { code: discountCode, usersClientId: uid },
        });

        if (responseDiscountCode) {
            const discountPercentage = responseDiscountCode.percentage || 0;
            const discountAmount = (totalPriceOriginla * discountPercentage) / 100;
            finalPriceWithDiscount = totalPriceOriginla - discountAmount;
            finalPriceWithDiscount = roundToNextHalfOrWhole(finalPriceWithDiscount);
        }
    }

    const resAddressStart = await geocoder.reverse({ lat: latitudeStartParse, lon: longitudeStartParse });
    const resAddressEnd = await geocoder.reverse({ lat: latitudeEndParse, lon: longitudeEndParse });

    const currentDateTime = new Date();
    const currentHour = new Date().toISOString().slice(11, 16);

    const existingTrip = await prisma.calculateTrip.findFirst({
        where: {
            usersClientId: uid,
            status: true
        }
    });

    if (existingTrip) {
        await prisma.calculateTrip.deleteMany({
            where: {
                usersClientId: uid,
                status: true
            }
        });
    };

    const responseCalculeTrip = prisma.calculateTrip.create({
        data: {
            usersClientId: uid,
            price: totalPriceOriginla,
            basePrice: basePricePerKmBase?.price!,
            paymentMethod: paymentMethod,
            kilometers: distance.distance,
            latitudeStart: latitudeStartParse,
            longitudeStart: longitudeStartParse,
            latitudeEnd: latitudeEndParse,
            longitudeEnd: longitudeEndParse,
            addressStart: resAddressStart[0].formattedAddress || "No disponible",
            addressEnd: resAddressEnd[0].formattedAddress || "No disponible",
            dateScheduled: currentDateTime,
            hourScheduledStart: currentHour,
            estimatedArrival: distance.estimatedArrival,
            vehicle: vehicle,
            priceWithDiscount: finalPriceWithDiscount,
            discountCode: discountCode || null,
            discountApplied: discountCode ? true : false
        }
    })

    return responseCalculeTrip
};

const tripCalculatePutService = async ({ tripId, uid, offeredPrice, discountCode }: PropsPutCalculateTripOfferedPrice) => {

    try {

        const validationTrip = await prisma.calculateTrip.findFirst({
            where: { uid: tripId, status: true }
        });

        if (!validationTrip) {
            console.error("viaje no existe");
            return;
        };

        let validOfferedPrice: number | null = null;
        if (offeredPrice && typeof offeredPrice === "number") {
            const minAcceptableOffer = validationTrip.price * 0.5;
            if (offeredPrice >= minAcceptableOffer) {
                validOfferedPrice = roundToNextHalfOrWhole(offeredPrice);
            }
        }

        const basePriceForDiscount = validOfferedPrice ?? validationTrip.price;

        let finalPriceWithDiscount = basePriceForDiscount;

        if (discountCode) {
            const responseDiscountCode = await prisma.discountCode.findFirst({
                where: { code: discountCode, usersClientId: uid },
            });

            if (responseDiscountCode) {
                const discountPercentage = responseDiscountCode.percentage || 0;
                const discountAmount = (basePriceForDiscount * discountPercentage) / 100;
                finalPriceWithDiscount = basePriceForDiscount - discountAmount;
                finalPriceWithDiscount = roundToNextHalfOrWhole(finalPriceWithDiscount);
            }
        }


        const responseCalculeTrip = prisma.calculateTrip.update({
            where: { uid: validationTrip.uid },
            data: {
                offeredPrice: validOfferedPrice,
                priceWithDiscount: finalPriceWithDiscount,
                discountCode: discountCode || null,
                discountApplied: discountCode ? true : false,
            }
        });

        return responseCalculeTrip

    } catch (err) {
        console.error("Error en el servicio del viaje programado");
    }

};

const tripCalculateDeleteService = async ({ tripId, uid }: PropsDeleteCalculateTrip) => {

    try {

        const validationTrip = await prisma.calculateTrip.findFirst({
            where: { uid: tripId, usersClientId: uid, status: true }
        });

        if (!validationTrip) {
            console.error("viaje no existe");
            return;
        };

        const responseCalculeTrip = await prisma.calculateTrip.update({
            where: { uid: validationTrip.uid },
            data: {
                status: false,
                cancelForUser: true
            }
        });

        return responseCalculeTrip;

    } catch (error) {
        console.error("Error en el servicio del viaje programado");
    }

};

export { tripCalculatePostService, tripCalculatePutService, tripCalculateDeleteService };