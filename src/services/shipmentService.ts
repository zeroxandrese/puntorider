import { PrismaClient } from "@prisma/client";

import { shipmentPostProps, shipmentPutProps, genericIdProps } from '../interface/interface';
import { calculationEstimatedArrival } from '../utils/calculateDistanceDriver';
import NodeGeocoder from "node-geocoder";

const options: NodeGeocoder.Options = {
    provider: 'google',
    apiKey: process.env.key
}

const geocoder = NodeGeocoder(options)

const prisma = new PrismaClient

const shipmentGetService = async ({ id }: genericIdProps) => {

    try {

        const shipmentResponseService = await prisma.shipment.findMany({ where: { usersDriverId: id } });

        return shipmentResponseService

    } catch (err) {
        throw new Error("Error en el servicio de shipment");

    }
};

const shipmentPostService = async ({ usersDriverId, latitudeStart, longitudeStart, latitudeEnd, longitudeEnd }: shipmentPostProps) => {

    try {

        const distance = await calculationEstimatedArrival({
            driverId: usersDriverId,
            longitude: longitudeEnd,
            latitude: latitudeEnd,
        });

        const resDeliveryAddress = await geocoder.reverse({ lat: latitudeStart, lon: longitudeStart });
        const resPickupAddress = await geocoder.reverse({ lat: latitudeEnd, lon: longitudeEnd });

        const shipmentResponseService = await prisma.shipment.create({
            data: {
                usersDriverId,
                deliveryAddress: resDeliveryAddress[0].formattedAddress,
                estimatedDelivery: distance.estimatedArrival,
                pickupAddress: resPickupAddress[0].formattedAddress
            }
        })

        return shipmentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del shipment");

    }
};

const shipmentPutService = async ({ usersDriverId, latitudeStart, longitudeStart, latitudeEnd, longitudeEnd, id, statusDelivery, note }: shipmentPutProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para generar un shipment.");
        }

        const existingShipment = await prisma.shipment.findUnique({
            where: { uid: id },
        });

        if (!existingShipment) {
            throw new Error("El shipment no existe.");
        }

        const shipmentResponseService = await prisma.$transaction(async (prisma) => {
            let deliveryAddress: string | undefined;
            let pickupAddress: string | undefined;
            let estimatedDelivery: string | undefined;

            if (latitudeStart && longitudeStart) {
                const resDeliveryAddress = await geocoder.reverse({ lat: latitudeStart, lon: longitudeStart });
                if (resDeliveryAddress.length > 0 && resDeliveryAddress[0].formattedAddress) {
                    deliveryAddress = resDeliveryAddress[0].formattedAddress;
                } else {
                    throw new Error("No se pudo obtener la dirección de entrega.");
                }
            }

            if (latitudeEnd && longitudeEnd) {
                const resPickupAddress = await geocoder.reverse({ lat: latitudeEnd, lon: longitudeEnd });
                if (resPickupAddress.length > 0 && resPickupAddress[0].formattedAddress) {
                    pickupAddress = resPickupAddress[0].formattedAddress;
                } else {
                    throw new Error("No se pudo obtener la dirección de recogida.");
                }
            }

            if (latitudeEnd && longitudeEnd) {
                const distance = await calculationEstimatedArrival({
                    driverId: usersDriverId,
                    longitude: longitudeEnd,
                    latitude: latitudeEnd,
                });
                estimatedDelivery = distance.estimatedArrival;
            }

            const updatedShipment = await prisma.shipment.update({
                where: { uid: id },
                data: {
                    deliveryAddress: deliveryAddress || existingShipment.deliveryAddress,
                    pickupAddress: pickupAddress || existingShipment.pickupAddress,
                    estimatedDelivery: estimatedDelivery || existingShipment.estimatedDelivery,
                    statusDelivery,
                    note
                }
            });

            if (statusDelivery === "Close") {
                await prisma.shipmentHistory.create({
                    data: {
                        shipmentId: existingShipment.uid,
                        statusDelivery: "Close",
                        pickupAddress: pickupAddress || existingShipment.pickupAddress,
                        shipmentNumber: existingShipment.shipmentNumber,
                        note
                    }
                });
            }

            return updatedShipment;
        });

        return shipmentResponseService;

    } catch (err) {
        throw new Error("Error en el servicio del shipment");

    }
};

const shipmentDeleteService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un shipment.");
        }

        const shipmentResponseService = await prisma.shipment.update({
            where: { uid: id },
            data: {
                status: false
            }
        })

        return shipmentResponseService

    } catch (err) {
        throw new Error("Error en el servicio del shipment");

    }
};

export { shipmentPostService, shipmentPutService, shipmentDeleteService, shipmentGetService };