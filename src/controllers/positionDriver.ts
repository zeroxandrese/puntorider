import { Request, Response } from "express";
import { positionDriverPostService, positionDriverDeleteService, positionDriverGetService } from '../services/positionDriverService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const positionDriverGetController = async (req: Request, res: Response) => {

    try {

        const responsePositionDriver = await positionDriverGetService();

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const positionDriverPostController = async (req: Request, res: Response) => {
    const { latitude, usersDriverId, longitude } = req.body

    try {
        if (!latitude || latitude === "" || !usersDriverId || usersDriverId === "" || !longitude || longitude === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responsePositionDriver = await positionDriverPostService({ latitude, usersDriverId, longitude });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const positionDriverDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responsePositionDriver = await positionDriverDeleteService({ id });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { positionDriverPostController, positionDriverDeleteController, positionDriverGetController };