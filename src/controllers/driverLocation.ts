import { Request, Response } from "express";
import { driverLocationPostService } from '../services/driverLocationService';

interface AuthenticatedRequest extends Request {
    userAuthDriver: {
        uid: string;
    }
}

const driverPostLocationController = async (req: AuthenticatedRequest, res: Response) => {
    const { uid, } = req.userAuthDriver;
    const { latitude, longitude } = req.body

    try {
        if (!uid || uid === "" || !latitude || !longitude ) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responsePositionDriver = await driverLocationPostService({ uid, latitude, longitude });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { driverPostLocationController };