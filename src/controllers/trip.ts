import { Request, Response } from "express";
import { tripPostService, tripPutService, tripDeleteService, tripGetService, tripAcceptService } from '../services/tripService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const tripGetController = async (req: any, res: Response) => {
    const uid = req.userAuth;

    try {
        if (
            !uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseTrip = await tripGetService({ id: uid });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const tripPostController = async (req: any, res: Response) => {
    const uid = req.userAuth;

    try {
        if (
            !uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseTrip = await tripPostService({ id: uid.uid });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const tripAcceptController = async (req: any, res: Response) => {
    const uid = req.userAuth;
    const id = req.params.id

    try {
        if (
            !uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseTripAccepted = await tripAcceptService({ driverId: uid.uid, tripId: id });

        res.status(201).json(responseTripAccepted)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const tripPutController = async (req: any, res: Response) => {
    const { complete, paid, cancelForUser } = req.body
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseTrip = await tripPutService({ complete, paid, id, cancelForUser });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const tripDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseTrip = await tripDeleteService({ id });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { tripPostController, tripPutController, tripDeleteController, tripGetController, tripAcceptController };