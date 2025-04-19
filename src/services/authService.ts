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

const encryptData = (data: string | number) => {
    return CryptoJS.AES.encrypt(data.toString(), process.env.secretKeyCrypto!).toString();
};

const encryptPhone = (phone: string | number) => {
    return CryptoJS.HmacSHA224(phone.toString(), process.env.secretKeyCrypto!).toString();
};

const decryptData = (encryptedPhone: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPhone, process.env.secretKeyCrypto!);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const generateReferralCode = (uid: string): string => {
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const uidPart = uid.slice(-5).toUpperCase();

    return `REF${randomPart}${uidPart}`; // Ej: REF0382K8Z5A
};

const prisma = new PrismaClient();

const verifyToken = async ({ uid }: UIDObject) => {

    try {
        if (!uid) {
            throw new Error('El token no se ha validado');
        }

        const emailDescrypt = decryptData(uid.email)
        const phone = decryptData(uid.numberPhone)

        const user = { ...uid, email: emailDescrypt, numberPhone: phone };

        const token = await generateJwt(uid.uid);

        return {
            user,
            token
        };

    } catch (error) {
        throw new Error('Algo salio mal, contacte con el administrador')
    }
};

// Componente no funcional comentado por (ANDRES)
/* const login = async ({ numberPhone }: PropsLogin) => {

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
}; */

const googleLogin = async ({ googleToken }: Props) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
        throw new Error("Falta configurar GOOGLE_CLIENT_ID");
    }

    try {
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: googleClientId
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error("No se pudo verificar el usuario de Google");
        }

        const { email, name, picture, sub: googleUserId } = payload;
        const emailEncrypted = encryptData(email);
        const emailHash = encryptPhone(email);

        let user = await prisma.usersClient.findFirst({
            where: { hashValidationEmail: emailHash }
        });

        if (!user) {
            user = await prisma.usersClient.create({
                data: {
                    email: emailEncrypted,
                    hashValidationEmail: emailHash,
                    name: name || "Aliado",
                    img: picture || null,
                    google: true,
                    googleUserId,
                }
            });

            const referralCode = generateReferralCode(user.uid);

            await prisma.usersClient.update({
                where: { uid: user.uid },
                data: { referralCode },
            });
        }

        const updatedUser = await prisma.usersClient.findFirst({
            where: { uid: user.uid }
        });

        const token = await generateJwt(updatedUser?.uid.toString());

        return {
            updatedUser,
            validationPhoneRequire: user.hashValidationPhone ? false : true,
            token
        };

    } catch (error: any) {
        console.error("Error en Google Login:", error);
        throw new Error("Error al iniciar sesión con Google. Intente más tarde.");
    }
};

export {
    /* login, */
    googleLogin,
    verifyToken
}