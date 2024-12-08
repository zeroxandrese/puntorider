import { Request, Response } from "express";
import { historyTripsClientGetGetService } from '../services/historyTripsClientService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const historyTripsClientGetController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;

    try {
        if ( !uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseHistoryTripClient = await historyTripsClientGetGetService({ id: uid });

        res.status(201).json(responseHistoryTripClient)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { historyTripsClientGetController }