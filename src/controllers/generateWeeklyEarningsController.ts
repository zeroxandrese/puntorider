import { Request, Response } from "express";
import { GetEarningsService } from "../services/earningsService";
import { calculateEarnings } from "../utils/calculateEarnings";


const calculateEarningsController = async (req: Request, res: Response) => {
    try {
        const responseCalculate = await calculateEarnings();

        res.status(201).json(responseCalculate)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};


const getEarningsController = async (req: any, res: Response) => {
    const { uid, } = req.userAuthDriver;

    try {
        if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });

        };
        const responseEarnings = await GetEarningsService({ id: uid });

        res.status(201).json(responseEarnings)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el position driver, comunicate con el admin");

    }

};

export { calculateEarningsController, getEarningsController }