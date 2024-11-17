import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from "../interface/interface";

const prisma = new PrismaClient();

const validarJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('z-token');

    if (!token) {
        res.status(401).json({
            msg: 'No hay token en la petición - token'
        });
        return;
    }

    try {
        if (!process.env.SECRETORPRIVATEKEY) {
            res.status(500).json({
                msg: 'No se encontró SECRETORPRIVATEKEY en el archivo .env',
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as JwtPayload;

        const userAuth = await prisma.usersClient.findUnique({ where: { uid: decoded.id } });

        if (!userAuth) {
            res.status(401).json({
                msg: 'Usuario no existe en la base de datos',
            });
            return;
        }

        (req as any).userAuth = userAuth;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido',
        });
    }
};

export default validarJWT;