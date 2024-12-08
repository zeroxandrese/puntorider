import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { JwtPayload } from "../interface/interface";

const prisma = new PrismaClient();

const generateJwt = async (id = ''): Promise<string | null> => {
  try {
    const payload: JwtPayload = { id };
    if (!process.env.SECRETORPRIVATEKEY) {
      throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
    }

    const token = jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null;
  }
};

const verifyToken = async (token = ''): Promise<any | null> => {
  try {
    if (token.length < 10) {
      return null;
    }

    if (!process.env.SECRETORPRIVATEKEY) {
      throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
    }
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as JwtPayload;
    const usuario = await prisma.usersClient.findUnique({ where:{ uid: decoded.id }});

    return usuario
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
};

export { generateJwt, verifyToken };
