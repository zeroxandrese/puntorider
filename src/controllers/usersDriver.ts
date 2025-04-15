import { Request, Response } from "express";
import { usersDriverPostService, usersDriverPutService, usersDriverDeleteService } from '../services/usersDriver';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const usersDriverPostController = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        if (!email || email === "" || !password || password === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseDriver = await usersDriverPostService({ email, password });

        res.status(201).json(responseDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const usersDriverPutController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;
    const { numberPhone, name, email, lastName } = req.body

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseUser = await usersDriverPutService({ numberPhone, name, email, uid, lastName });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const usersDriverDeleteController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseUser = await usersDriverDeleteService({ uid });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { usersDriverPostController, usersDriverPutController, usersDriverDeleteController };