import { Request, Response } from "express";
import { historyTripsDriverGetGetService } from '../services/historyTripsDriverService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const historyTripsDriverGetController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseHistory = await historyTripsDriverGetGetService({ id: uid });

        res.status(201).json(responseHistory);

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

export { historyTripsDriverGetController };