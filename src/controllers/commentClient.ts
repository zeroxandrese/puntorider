import { Request, Response } from "express";
import { commentClientPostService, commentClientPutService, commentClientDeleteService, commentClientGetService } from '../services/commentClientService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const commentClientGetController = async (req: any, res: Response) => {
    const id = req.params.id;

    try {
        if ( !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await commentClientGetService({ id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

const commentClientPostController = async (req: any, res: Response) => {
    const id = req.params.id;
    const { comment } = req.body
    const { uid } = req.userAuth;

    try {
        if (!comment || comment === "" || !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await commentClientPostService({ comment, usersClientId: uid, tripId: id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const commentClientPutController = async (req: any, res: Response) => {
    const { comment } = req.body
    const id = req.params.id;

    try {
        if ( !comment || comment === "" || !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await commentClientPutService({ comment, id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const commentClientDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseComment = await commentClientDeleteService({ id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { commentClientPostController, commentClientPutController, commentClientDeleteController, commentClientGetController };