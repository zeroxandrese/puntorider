import { Request, Response } from "express";
import { shipmentPostService, shipmentPutService, shipmentDeleteService, shipmentGetService } from '../services/shipmentService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const shipmentGetController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseShipment = await shipmentGetService({ id });

        res.status(201).json(responseShipment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const shipmentPostController = async (req: Request, res: Response) => {
    const { usersDriverId,
        latitudeStart,
        longitudeStart,
        latitudeEnd,
        longitudeEnd
    } = req.body
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseShipment = await shipmentPostService({
            usersDriverId,
            latitudeStart,
            longitudeStart,
            latitudeEnd,
            longitudeEnd
        });

        res.status(201).json(responseShipment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const shipmentPutController = async (req: any, res: Response) => {
    const {
        usersDriverId,
        latitudeStart,
        longitudeStart,
        latitudeEnd,
        longitudeEnd,
        note,
        statusDelivery
    } = req.body
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseShipment = await shipmentPutService({
            usersDriverId,
            latitudeStart,
            longitudeStart,
            latitudeEnd,
            longitudeEnd,
            note,
            statusDelivery,
            id
        });

        res.status(201).json(responseShipment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const shipmentDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseShipment = await shipmentDeleteService({ id });

        res.status(201).json(responseShipment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { shipmentPostController, shipmentPutController, shipmentDeleteController, shipmentGetController };