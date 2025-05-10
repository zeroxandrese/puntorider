import { Request, Response } from "express";
import { vehiclesGetService } from '../services/vehiclesService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const vehiclesGetController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseVehicles = await vehiclesGetService({ id: uid });

        res.status(201).json(responseVehicles)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { vehiclesGetController };