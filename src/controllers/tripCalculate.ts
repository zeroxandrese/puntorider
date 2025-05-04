import { Request, Response } from "express";
import { tripCalculatePostService, tripCalculatePutService, tripCalculateDeleteService } from '../services/tripCalculateService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const tripCalculatePostController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { latitudeStart,
        longitudeStart,
        discountCode,
        latitudeEnd,
        longitudeEnd,
        paymentMethod,
        discountApplied,
        vehicle
    } = req.body

    try {
        if (
            !latitudeStart || latitudeStart === "" ||
            !longitudeStart || longitudeStart === "" ||
            !latitudeEnd || latitudeEnd === "" ||
            !longitudeEnd || longitudeEnd === "" ||
            !paymentMethod || paymentMethod === "" ||
            !vehicle || vehicle === ""
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
            paymentMethod,
            vehicle
        });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const tripCalculatePutController = async (req: any, res: Response) => {

    const { uid } = req.userAuth;
    const id = req.params.id;
    const { offeredPrice, discountCode } = req.body;

    try {

        if (!uid || !id) {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

      const responseTrip = await tripCalculatePutService({ uid, tripId: id, offeredPrice, discountCode });

      res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");
    }

};

const tripCalculateDeleteController = async (req: any, res: Response) => {

    const { uid } = req.userAuth;
    const id = req.params.id;

    try {

        if (!uid || !id) {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

      const responseTrip = await tripCalculateDeleteService({ uid, tripId: id});

      res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");
    }

};

export { tripCalculatePostController, tripCalculatePutController, tripCalculateDeleteController }