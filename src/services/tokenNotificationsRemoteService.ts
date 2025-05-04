import { PrismaClient } from "@prisma/client";

import { TokenNotificationProps } from '../interface/interface';

const prisma = new PrismaClient;

const tokenNotificationsRemotePostService = async ({ fcmToken, uid }: TokenNotificationProps) => {

    try {

       const validationToken = await prisma.tokenNotification.findFirst({
        where:{ usersClientId: uid }
       });

       if (validationToken) {
        const tokenResponseService = await prisma.tokenNotification.update({
            where:{ uid: validationToken.uid },
            data: {
                fcmToken
            }
        });

        return tokenResponseService
       }

       const tokenResponseService = await prisma.tokenNotification.create({
            data: {
                fcmToken,
                usersClientId: uid
            }
        });

        return tokenResponseService

    } catch (err) {
        console.error("Error en el servicio del survey");
        
    }
};

export { tokenNotificationsRemotePostService };

