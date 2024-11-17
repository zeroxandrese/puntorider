import { Request, Response } from "express";
import { usersClientPostService, usersClientPutService, usersClientDeleteService } from '../services/usersClient';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const usersClientPostController = async (req: Request, res: Response) => {
    const { numberPhone } = req.body

    try {
        if (!numberPhone || numberPhone === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseUser = await usersClientPostService({ numberPhone });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const usersClientPutController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { numberPhone, name, email } = req.body

    try {
        if (!numberPhone || numberPhone === "" || !name || name === "" || !email || email === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseUser = await usersClientPutService({ numberPhone, name, email, uid });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const usersClientDeleteController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;

    try {

        const responseUser = await usersClientDeleteService({ uid });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { usersClientPostController, usersClientPutController, usersClientDeleteController };