import { Request, Response } from "express";

import { tripRejectedPostService } from "../services/tripRejectedService";

const tripRejectedController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;
    const id = req.params.id;

    try {

        const responseTrip = await tripRejectedPostService({ uid, tripId: id });

        res.status(201).json(responseTrip)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { tripRejectedController };