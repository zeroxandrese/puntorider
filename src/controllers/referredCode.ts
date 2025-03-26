import { Request, Response } from "express";
import { referredCodeGetService, referredCodePostService } from "../services/referredCodeService";

const referredCodeGetController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    
    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseReferredCode = await referredCodeGetService({ id: uid });

        res.status(201).json(responseReferredCode)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

const referredCodePostController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { code } = req.body;
    const idreferenced = req.params.id;
    
    try {
        if (!code || code === "" || !idreferenced || idreferenced === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseReferredCode = await referredCodePostService({ id: uid, code, idreferenced });

        res.status(201).json(responseReferredCode)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

export { referredCodePostController, referredCodeGetController };