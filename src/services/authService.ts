import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';

import { UIDObject, PropsLogin } from '../interface/interface'

import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwt } from '../helpers/generate-jwt';

interface Props {
    googleToken: string
}

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


const login = async ({ numberPhone }: PropsLogin) => {

    try {
        const phoneEncrypt = encryptData(numberPhone)

        const userResponse = await prisma.usersClient.findFirst({
            where: { numberPhone: phoneEncrypt }
        });

        if (!userResponse) {
            throw new Error("The user is incorrect")
        }

        //Validacion usuario activo
        if (!userResponse.status) {
            throw new Error("User disable")
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

        return {
            user,
            token
        };


    } catch (err) {
        throw new Error('Algo salio mal, contacte con el administrador');
    }
};

const googleLogin = async ({ googleToken }: Props) => {

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
            throw new Error('Error contacte al admin')
        }

        if (!payload.email) {
            throw new Error('Error con el email')
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

        return {
            user,
            token
        };

    } catch (error) {
        throw new Error('Algo salio mal, contacte con el administrador');
    }
};

export {
    login,
    googleLogin,
    verifyToken
}