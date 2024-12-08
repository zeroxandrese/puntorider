import { Request, Response } from "express";

import { verifyToken } from "../services/authService";
import { googleLogin, login } from "../services/authService";

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

const googleLoginController = async (req: Request, res: Response) => {
    const { googleToken } = req.body

    try {
        if (!googleToken) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseUser = await googleLogin({ googleToken });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const loginController = async (req: Request, res: Response) => {
    const { numberPhone } = req.body

    try {
        if (!numberPhone || numberPhone === "" ) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseUser = await login({ numberPhone });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};


export { verifyTokenController, googleLoginController, loginController };