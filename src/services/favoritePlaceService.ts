import { PrismaClient } from "@prisma/client";
import NodeGeocoder from "node-geocoder";

const options: NodeGeocoder.Options = {
    provider: 'google',
    apiKey: process.env.key
}

const geocoder = NodeGeocoder(options)

import { favoritePlaceProps, genericIdProps } from '../interface/interface'

const prisma = new PrismaClient

const favoritePlacePostService = async ({ latitude, longitude, usersClientId }: favoritePlaceProps) => {

    try {

        const resAddress = await geocoder.reverse({ lat: latitude, lon: longitude });

        const favoritePlaceResponseService = await prisma.favoritePlace.create({

            data: {
                latitude,
                usersClientId,
                longitude,
                address: resAddress[0].formattedAddress
            }
        })

        return favoritePlaceResponseService

    } catch (err) {
        throw new Error("Error en el servicio del favorito");

    }
};

const favoritePlaceGetService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un lugar favorito.");
        }

        const favoritePlaceResponseService = await prisma.favoritePlace.findMany({ where: { usersClientId: id } });

        return favoritePlaceResponseService

    } catch (err) {
        throw new Error("Error en el servicio del lugar favorito");

    }
};

const favoritePlaceDeleteService = async ({ id }: genericIdProps) => {

    try {

        if (!id) {
            throw new Error("El UID es obligatorio para actualizar un lugar favorito.");
        }

        const favoritePlaceResponseService = await prisma.favoritePlace.update({
            where: { uid: id },
            data: {
                status: false
            }
        })

        return favoritePlaceResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

export { favoritePlacePostService, favoritePlaceGetService, favoritePlaceDeleteService };