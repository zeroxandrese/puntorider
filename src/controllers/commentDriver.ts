import { Request, Response } from "express";
import { commentDriverPostService, commentDriverPutService, commentDriverDeleteService, commentDriverGetService } from '../services/commentDriverService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const commentDriverGetController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responsePositionDriver = await commentDriverGetService({ id });

        res.status(201).json(responsePositionDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const commentDriverPostController = async (req: any, res: Response) => {
    const id = req.params.id;
    const { comment } = req.body
    const { uid } = req.userAuthDriver;

    try {
        if (!comment || comment === "" || !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await commentDriverPostService({ comment, usersDriverId: uid, tripId: id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const commentDriverPutController = async (req: any, res: Response) => {
    const { comment } = req.body
    const id = req.params.id;

    try {
        if (!comment || comment === "" || !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await commentDriverPutService({ comment, id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const commentDriverDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseComment = await commentDriverDeleteService({ id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { commentDriverPostController, commentDriverPutController, commentDriverDeleteController, commentDriverGetController };