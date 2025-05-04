import { Request, Response } from "express";
import { tokenNotificationsRemotePostService  } from '../services/tokenNotificationsRemoteService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const tokenNotificationsRemotePostController = async (req: any, res: Response) => {
    const { fcmToken } = req.body
    const { uid } = req.userAuth;

    try {

        if (!fcmToken || !uid ) {
            res.status(401).json({
                msg: "Información faltante"
            });
            return;
        };

        const responseToken = await tokenNotificationsRemotePostService({ uid, fcmToken });

        res.status(201).json(responseToken)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { tokenNotificationsRemotePostController };
