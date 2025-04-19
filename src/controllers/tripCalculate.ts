import { Request, Response } from "express";
import { tripCalculatePostService } from '../services/tripCalculateService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const tripCalculatePostController = async (req: any, res: Response) => {
    const uid = req.userAuth;
    const { latitudeStart,
        longitudeStart,
        discountCode,
        latitudeEnd,
        longitudeEnd,
        paymentMethod,
        discountApplied
    } = req.body

    try {
        if (
            !latitudeStart || latitudeStart === "" ||
            !longitudeStart || longitudeStart === "" ||
            !latitudeEnd || latitudeEnd === "" ||
            !longitudeEnd || longitudeEnd === "" ||
            !paymentMethod || paymentMethod === ""
        ) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseTrip = await tripCalculatePostService({
            latitudeStart,
            uid,
            discountCode,
            discountApplied,
            longitudeStart,
            latitudeEnd,
            longitudeEnd,
            paymentMethod
        });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { tripCalculatePostController }