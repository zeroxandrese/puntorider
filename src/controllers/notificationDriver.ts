import { Request, Response } from "express";
import { notificationsDriverPutService } from '../services/notificationDriverService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const notificationsDriverPutController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {

        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responsePositionNotificationsDriver = await notificationsDriverPutService({ id });

        res.status(201).json(responsePositionNotificationsDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { notificationsDriverPutController };