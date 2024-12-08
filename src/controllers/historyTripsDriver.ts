import { Request, Response } from "express";
import { historyTripsDriverGetGetService } from '../services/historyTripsDriverService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const historyTripsDriverGetController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;

    try {
        if ( !uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responsePositionDriver = await historyTripsDriverGetGetService({ id: uid });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { historyTripsDriverGetController }