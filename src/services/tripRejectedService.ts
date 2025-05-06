import { PrismaClient } from "@prisma/client";

import { cancelTripProps } from '../interface/interface';

const prisma = new PrismaClient;

const tripRejectedPostService = async ({ tripId, uid }: cancelTripProps) => {

    try {


       const surveysResponseService = await prisma.rejectedTripForDriver.create({
            data: {
                usersDriverId: uid,
                tripId
            }
        });

        return surveysResponseService

    } catch (err) {
        console.error("Error en el servicio del survey");
        
    }
};

export { tripRejectedPostService };