import { Request, Response } from "express";

import { verifyToken, loginDriver } from "../services/authDriverService";

const verifyTokenDriverController = async (req: any, res: Response) => {
    const uid = req.userAuthDriver;

    try {

        const responseUser = await verifyToken({ uid });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const loginDriverController = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        if (!email || !password || email === "" || password === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseUser = await loginDriver({ email, password });

        res.status(201).json(responseUser)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};


export { verifyTokenDriverController, loginDriverController };