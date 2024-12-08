import { Request, Response } from "express";
import { discountCodePostService, discountCodePutService, discountCodeDeleteService, discountCodeGetService } from '../services/discountCodeService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
};

const discountCodeGetController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if ( !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await discountCodeGetService({ id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el code, comunicate con el admin");

    }

};

const discountCodePostController = async (req: Request, res: Response) => {
    const { usersClientId, code, percentage } = req.body

    try {
        if (!percentage || percentage === "" || !usersClientId || usersClientId === "" || !code || code === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await discountCodePostService({ percentage, usersClientId, code });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro del code, comunicate con el admin");

    }

};

const discountCodePutController = async (req: any, res: Response) => {
    const { percentage, usersClientId, code } = req.body
    const id = req.params.id;

    try {
        if ( !id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseComment = await discountCodePutService({ percentage, usersClientId, code, id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro del code, comunicate con el admin");

    }

};

const discountCodeDeleteController = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if (!id || id === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseComment = await discountCodeDeleteService({ id });

        res.status(201).json(responseComment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro del code, comunicate con el admin");

    }

};

export { discountCodePostController, discountCodePutController, discountCodeDeleteController, discountCodeGetController };