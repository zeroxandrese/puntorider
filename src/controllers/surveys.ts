import { Request, Response } from "express";
import { surveysClientPostService, surveysDriverPostService  } from '../services/surveysService';

interface AuthenticatedRequest extends Request {
    userAuth: {
        uid: string;
    }
}

const surveysDriversPostController = async (req: any, res: Response) => {
    const id = req.params.id;
    const { feedback, score } = req.body
    const { uid } = req.userAuthDriver;

    try {

        if (!score || score === "" || !id || id === "" || !feedback || feedback === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
            return;
        };

        const responseSurveys = await surveysDriverPostService({ feedback, score, usersDriverId: uid, tripId: id });

        res.status(201).json(responseSurveys)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

const surveysClientsPostController = async (req: any, res: Response) => {
    const id = req.params.id;
    const { score, feedback } = req.body
    const { uid } = req.userAuth;

    try {

        if (!score || score === "" || !id || id === "" || !feedback || feedback === "") {
            res.status(401).json({
                msg: "Información faltante"
            });
            return;
        };

        const responseSurveys = await surveysClientPostService({ feedback, score, usersClientId: uid, tripId: id });

        res.status(201).json(responseSurveys)

    } catch (error) {
        res.sendStatus(501)
        throw new Error("Problemas con el registro, comunicate con el admin");

    }

};

export { surveysClientsPostController,  surveysDriversPostController };