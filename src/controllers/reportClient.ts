import { Request, Response } from "express";
import { reportClientService } from "../services/reportClientService";

const reportClientPostController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { comment } = req.body;
    
    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseReportClient = await reportClientService({ id: uid, comment });

        res.status(201).json(responseReportClient)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

export { reportClientPostController };