import { Request, Response } from "express";
import { cancelTripDriverPostService, cancelTripClientsPostService } from '../services/cancelTripService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const cancelTripClientPostController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const id = req.params.id;

    try {
        if (!id || id === "" || !uid || uid === "" ) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };
console.log('por el controller de cancel')
        const responseContactUs = await cancelTripClientsPostService({ tripId: id, uid });

        res.status(201).json(responseContactUs)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const cancelTripDriverPostController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;
    const id = req.params.id;

    try {
        if (!id || id === "" || !uid || uid === "" ) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseContactUs = await cancelTripDriverPostService({ tripId: id, uid });

        res.status(201).json(responseContactUs)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};


export { cancelTripDriverPostController, cancelTripClientPostController };