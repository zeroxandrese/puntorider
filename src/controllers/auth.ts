import { Request, Response } from "express";
import { verifyToken } from "../services/authService";

const verifyTokenController = async (req: any, res: Response) => {
    const uid = req.userAuth;

    try {

        const responseUser = await verifyToken({ uid });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const googleLoginController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { googleToken } = req.body

    try {
        if (!googleToken) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseUser = await usersClientPutService({ googleToken, uid });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const loginController = async (req: any, res: Response) => {
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


export { verifyTokenController, googleLoginController, loginController };