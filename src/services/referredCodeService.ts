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

const referredCodePostService = async ({ id, code, idreferenced }: referredCodeProps) => {

    try {

       const referredCodeResponseService = await prisma.referredCodeUsed.create({
            data: {
                usersClientId: id,
                usersClientReferencedId: idreferenced,
                code
            }
        })

        return referredCodeResponseService

    } catch (err) {
        throw new Error("Error en el servicio del code referenciado");
        
    }
};

export { referredCodePostService, referredCodeGetService };
