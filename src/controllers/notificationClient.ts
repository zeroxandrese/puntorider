import { Request, Response } from "express";
import { notificationsClientPutService } from '../services/notificationClientService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const notificationsClientPutController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {

        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responsePositionNotificationsClient = await notificationsClientPutService({ id });

        res.status(201).json(responsePositionNotificationsClient)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { notificationsClientPutController };