import { Request, Response } from "express";
import { validationCodePostAuthService, validationCodePostService, validationCodePutAuthService } from "../services/validationCodeService";

const validationCodePostAuthController = async (req: Request, res: Response) => {
    const { code, codeSecurity } = req.body;

    try {
      
        if (!code || code === "" || !codeSecurity || codeSecurity === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseUser = await validationCodePostAuthService({ code, codeSecurity });

        res.status(201).json(responseUser)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

const validationCodePutAuthController = async (req: any, res: Response) => {
    const { code, codeSecurity } = req.body;
    const uid = req.userAuth;

    try {
      
        if (!code || code === "" || !codeSecurity || codeSecurity === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseUser = await validationCodePutAuthService({ uid: uid.uid, code, codeSecurity });

        res.status(201).json(responseUser)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

const validationCodePostController = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    try {
        if (!phoneNumber) {
            res.status(401).json({
                msg: "Información faltante"
            });
        }

        const responseValidationCode = await validationCodePostService({ phoneNumber });

        res.status(201).json(responseValidationCode)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

export { validationCodePostController, validationCodePostAuthController, validationCodePutAuthController };