import { Request, Response } from "express";
import { scheduledTripPostService, scheduledTripDeleteService, scheduledTripGetService, scheduledTripPutService } from '../services/scheduledTripService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const scheduledTripGetController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseScheduledTrip = await scheduledTripGetService({ id });

        res.status(201).json(responseScheduledTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el viaje programado, comunicate con el admin");

    }

};

const scheduledTripPutController = async (req: Request, res: Response) => {
    const { cancelForUser } = req.body
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseScheduledTrip = await scheduledTripPutService({ id, cancelForUser });

        res.status(201).json(responseScheduledTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el viaje programado, comunicate con el admin");

    }

};

const scheduledTripPostController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseScheduledTrip = await scheduledTripPostService({ id });

        res.status(201).json(responseScheduledTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el viaje programado, comunicate con el admin");

    }

};

const scheduledTripDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseScheduledTrip = await scheduledTripDeleteService({ id });

        res.status(201).json(responseScheduledTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el viaje programado, comunicate con el admin");

    }

};

export { scheduledTripPostController, scheduledTripDeleteController, scheduledTripGetController, scheduledTripPutController };