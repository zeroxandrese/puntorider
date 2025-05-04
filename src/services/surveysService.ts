import { PrismaClient } from "@prisma/client";

import { DriversSurveysProps, clientsSurveysProps } from '../interface/interface';

const prisma = new PrismaClient;

const surveysDriverPostService = async ({ score, feedback, usersDriverId, tripId }: DriversSurveysProps) => {

    try {


       const surveysResponseService = await prisma.driversSurveys.create({
            data: {
                feedback,
                score: Number(score),
                usersDriverId,
                tripId
            }
        });

        return surveysResponseService

    } catch (err) {
        console.error("Error en el servicio del survey");
        
    }
};

const surveysClientPostService = async ({ score, feedback, usersClientId, tripId }: clientsSurveysProps) => {

    try {

       const surveysResponseService = await prisma.clientsSurveys.create({
            data: {
                feedback,
                score: Number(score),
                usersClientId,
                tripId
            }
        });

        return surveysResponseService

    } catch (err) {
        console.error("Error en el servicio del survey");
        
    }
};

export { surveysClientPostService, surveysDriverPostService };