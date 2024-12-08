import { Request, Response } from "express";
import { favoritePlacePostService, favoritePlaceDeleteService, favoritePlaceGetService } from '../services/favoritePlaceService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const favoritePlaceGetController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {

        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responsePositionDriver = await favoritePlaceGetService({ id });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const favoritePlacePostController = async (req: Request, res: Response) => {
    const { latitude, usersClientId, longitude } = req.body

    try {
        if (!latitude || latitude === "" || !usersClientId || usersClientId === "" || !longitude || longitude === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responsePositionDriver = await favoritePlacePostService({ latitude, usersClientId, longitude });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const favoritePlaceDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responsePositionDriver = await favoritePlaceDeleteService({ id });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { favoritePlacePostController, favoritePlaceDeleteController, favoritePlaceGetController };