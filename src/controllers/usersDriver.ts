import { Request, Response } from "express";
import { countCommentsService } from '../services/comments';

const usersDriverController = async (req: Request, res: Response) => {

    try {
        const responseCountImages = await countCommentsService();

        res.status(201).json(responseCountImages)

    } catch (error) {
        throw new Error("Problemas con el registro, comunicate con el admin");
    }
};

export { usersDriverController };