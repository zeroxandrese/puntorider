import { Request, Response } from "express";
import { paymentPostService } from '../services/paymentService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const paymentPostController = async (req: Request, res: Response) => {
    //const { uid } = req.userAuth;
    //const { cardNumberEncrypt, ccvEncrypt, dateEncrypt, titleEncrypt } = req.body

    try {

/*         if (!uid || uid === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        } */

        const responsePayment = await paymentPostService();

        res.status(201).json(responsePayment)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el payment, comunicate con el admin");

    }

};

export { paymentPostController };