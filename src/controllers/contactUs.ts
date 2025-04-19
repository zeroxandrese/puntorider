import { Request, Response } from "express";
import { contactUsPostService } from '../services/contactUsService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const contactUsPostController = async (req: any, res: Response) => {
    const { uid } = req.userAuth;
    const { comment } = req.body

    try {
        if (!comment || comment === "" || !uid || uid === "" ) {
            res.status(401).json({
                msg: "Información faltante"
            });

        };

        const responseContactUs = await contactUsPostService({ comment, uid });

        res.status(201).json(responseContactUs)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};


export { contactUsPostController };