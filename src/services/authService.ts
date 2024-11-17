import { response, request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';

import { UIDObject } from '../interface/interface'

import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwt } from '../helpers/generate-jwt';
import { string } from 'zod';

const decryptData = (encryptedPhone: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPhone, process.env.secretKeyCrypto!);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptData = (data: string | number) => {
    return CryptoJS.AES.encrypt(data.toString(), process.env.secretKeyCrypto!).toString();
};

const prisma = new PrismaClient();

const verifyToken = async ({ uid }: UIDObject) => {

    try {
        if (!uid) {
            throw new Error('El token no se ha validado');
        }

        const email = decryptData(uid.email)
        const phone = decryptData(uid.numberPhone)
        
        const user = { ...uid, email, numberPhone: phone };

        return user

    } catch (error) {
        throw new Error('Algo salio mal, contacte con el administrador')
    }
};


const login = async (req: any, res = response) => {

    const { numberPhone } = req.body;

    try {
        const phoneEncrypt = encryptData(numberPhone)

        const userResponse = await prisma.usersClient.findFirst({
            where: { numberPhone: phoneEncrypt }
        });

        if (!userResponse) {
            return res.status(400).json({
                msg: 'The user is incorrect'
            });
        }

        //Validacion usuario activo
        if (!userResponse.status) {
            return res.status(400).json({
                msg: 'User disable'
            });
        }

        //Generar JWT
        const token = await generateJwt(userResponse.uid);

        let email = ""
        let phone = ""

        if (userResponse?.email && userResponse?.numberPhone) {
            email = decryptData(userResponse?.email)
            phone = decryptData(userResponse?.numberPhone)
            
        }

        const user = { ...userResponse, email, numberPhone: phone };

        res.json({
            user,
            token
        });


    } catch (err) {
        res.status(500).json({
            msg: 'Algo salio mal, contacte con el administrador'
        })
    }
};

const googleLogin = async ({ googleToken }: string) => {

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    try {
        // Verificar el token de Google usando la librería google-auth-library
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: googleClientId
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(500).json({
                msg: 'Error please contact the admin'
            });
        }

        if (!payload.email) {
            return res.status(500).json({
                msg: 'Payload without email'
            });
        }

        const googleUserId = payload.sub;
        const emailEncryptData = encryptData(payload.email)
        // Verificar si el usuario ya está registrado en tu base de datos
        let user = await prisma.usersClient.findFirst({
            where: { email: emailEncryptData }
        });

        // Creación del usuario si no existe
        if (!user) {
            const { name, picture } = payload;
            user = await prisma.usersClient.create({
                data: {
                    email: emailEncryptData || 'default@example.com',
                    name: name || 'Aliado',
                    img: picture,
                    google: true,
                    googleUserId,
                }
            });
        }

        const userId = user.uid.toString();
        const token = await generateJwt(userId);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export {
    login,
    googleLogin,
    verifyToken
}