import { Request, Response } from "express";
import { usersDriverPostService, usersDriverPutService, usersDriverDeleteService, usersDriverGetService, usersDriverPutAvatarService } from '../services/usersDriver';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const usersDriverPostController = async (req: Request, res: Response) => {
    const { email, password, code } = req.body

    try {
        if (!email || email === "" || !password || password === "" || !code || code === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseDriver = await usersDriverPostService({ email, password, code });

        res.status(201).json(responseDriver)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const usersDriverGetController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseDriver = await usersDriverGetService({ id: uid });

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

const usersDriverPutAvatarController = async (req: any, res: Response) => {
    const { uid } = req.userAuthDriver;
    const file = req.file;

    try {
        if (!uid || uid === "" || !file ) {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseUser = await usersDriverPutAvatarService({ uid, file });

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

export { usersDriverPostController, usersDriverPutController, usersDriverDeleteController, usersDriverGetController, usersDriverPutAvatarController };