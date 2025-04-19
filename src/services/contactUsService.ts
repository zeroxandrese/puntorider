import { PrismaClient } from "@prisma/client";

import { contactUsProps } from '../interface/interface'

const prisma = new PrismaClient

const contactUsPostService = async ({ comment, uid }: contactUsProps) => {

    try {

       const contactUsResponseService = await prisma.contactUs.create({
            data: {
                usersClientId: uid,
                comment
            }
        })

        return contactUsResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

export { contactUsPostService };
