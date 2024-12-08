import { Request, Response } from "express";
import { reportDriverService } from '../services/reportDriverService';

const reportDriverController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { comment } = req.body;

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseCountReports = await reportDriverService({ comment, id: uid });

        res.status(201).json(responseCountReports)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

export { reportDriverController };