import { PrismaClient } from "@prisma/client";

import { genericIdProps, referredCodeProps } from '../interface/interface'

const prisma = new PrismaClient

const referredCodeGetService = async ({ id }: genericIdProps) => {

    try {

        const referredCodeResponseService = await prisma.referredCodeEnable.findMany({
            where: { usersClientId: id }
        })

        return referredCodeResponseService

    } catch (err) {
        throw new Error("Error en el servicio del code referenciado");

    }
};

const referredCodePostService = async ({ id, code }: referredCodeProps) => {
    try {

        const codeParse = code.toLocaleUpperCase();

        const validationCodeUsed = await prisma.referredCodeUsed.findFirst({
            where: { usersClientId: id }
        });
   
        if (validationCodeUsed) {
            return { validationCodeUsed: false }
        };

        const validationCodeExists = await prisma.usersClient.findFirst({
            where: { referralCode: codeParse }
        });
 
        if (!validationCodeExists) {
            return { validationCodeUsed: false }
        };

        await prisma.referredCodeUsed.create({
            data: {
                usersClientId: id,
                usersClientReferencedId: validationCodeExists.uid,
                referralCode: codeParse
            }
        })

        return { validationCodeUsed: true }

    } catch (err) {
        throw new Error("Error en el servicio del code referenciado");

    }
};

export { referredCodePostService, referredCodeGetService };
