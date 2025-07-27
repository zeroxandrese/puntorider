import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

import { generateJwt } from '../helpers/generate-jwt';
import { phoneNumberProps, validationCodeProps, validationCodePropsGeneric } from '../interface/interface';

const prisma = new PrismaClient

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

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

const client = twilio(accountSid, authToken);

const generateDigitCode = (): string => {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

const validationCodePostService = async ({ phoneNumber }: phoneNumberProps) => {
    try {
        const code = generateDigitCode();
        const codeSecurityGenerated = uuidv4();
        const encryptedPhone = encryptData(phoneNumber.toString());
        const encryptedSearchPhone = encryptPhone(phoneNumber.toString());

        await prisma.validationCodeSMS.deleteMany({
            where: { hashValitadionPhone: encryptedSearchPhone },
        });

        try {
            await client.messages.create({
                body: `Hola, usa este código para continuar en Puntoride: ${code}. ¡Gracias por elegirnos!`,
                to: `+58${phoneNumber}`,
                from: '+18587805265',
            });
        } catch (twilioError) {
            console.error("Error enviando SMS:", twilioError);
            throw new Error("Error al enviar el código de validación.");
        }

        const validationCodeResponseService = await prisma.validationCodeSMS.create({
            data: {
                code,
                numberPhone: encryptedPhone,
                hashValitadionPhone: encryptedSearchPhone,
                codeSecurity: codeSecurityGenerated,
            },
        });

        return { codeValidationNumberSecurity: validationCodeResponseService.codeSecurity };

    } catch (err) {
        console.error("Error en validationCodePostService:", err);
        throw new Error("Error en el servicio del código de validación.");
    }
};

const validationCodePostAuthService = async ({ code, codeSecurity }: validationCodePropsGeneric) => {

    try {
        if (!code || !codeSecurity) {
            return { error: "El código y el código de seguridad son obligatorios." };
        }

        const responseValidation = await prisma.validationCodeSMS.findFirst({
            where: { code, codeSecurity }
        });

        if (!responseValidation) {
            return { error: "Código no válido para el usuario." };

        }

        let user = await prisma.usersClient.findFirst({
            where: { hashValidationPhone: responseValidation.hashValitadionPhone }
        });

        if (user && user.numberPhone) {
            try {
                const decryptedPhone = decryptData(user.numberPhone);
                const token = await generateJwt(user.uid);
                return { user: { ...user, numberPhone: decryptedPhone }, token };
            } catch (error) {
                console.error("Error en desencriptación:", error);
            }
        }

        // Crear usuario si no existe
        const newUser = await prisma.usersClient.create({
            data: {
                name: "Aliado",
                email: encryptData("default@example.com"),
                hashValidationEmail: encryptPhone("default@example.com"),
                numberPhone: responseValidation.numberPhone,
                hashValidationPhone: responseValidation.hashValitadionPhone
            }
        });

        const referralCode = generateReferralCode(newUser.uid);

        await prisma.usersClient.update({
            where: { uid: newUser.uid },
            data: { referralCode },
        });

        const updatedUser = await prisma.usersClient.findFirst({
            where: { uid: newUser.uid }
        });

        if (updatedUser?.numberPhone) {
            const decryptedPhone = decryptData(updatedUser.numberPhone);
            const token = await generateJwt(updatedUser.uid);

            return {
                user: { ...updatedUser, numberPhone: decryptedPhone },
                token
            };
        }

    } catch (error) {
        console.error("Error en validationCodePostAuthService:", error);
        throw new Error("Error en el servicio del código referenciado.");
    }
};

const validationCodePutAuthService = async ({ uid, code, codeSecurity }: validationCodeProps) => {
    try {

        if (!code || !codeSecurity) {
            return { error: "El código y el código de seguridad son obligatorios." };
        }

        // Buscar el código en la base de datos
        const responseValidation = await prisma.validationCodeSMS.findFirst({
            where: { code, codeSecurity },
        });

        if (!responseValidation) {
            return { error: "Código no válido para el usuario." };
        }

        const user = await prisma.usersClient.findFirst({
            where: { uid },
        });

        if (!user) {
            return { error: "Usuario no encontrado." };
        }

        if (user.hashValidationPhone) {

            try {
                const decryptedPhone = decryptData(responseValidation.numberPhone);
                const token = await generateJwt(user.uid);
                return { user: { ...user, numberPhone: decryptedPhone }, token };
            } catch (error) {
                console.error("Error en desencriptación:", error);
                return { error: "No se pudo desencriptar el número de teléfono." };
            }
        } else {

            const userModified = await prisma.usersClient.update({
                where: { uid },
                data: {
                    numberPhone: responseValidation.numberPhone,
                    hashValidationPhone: responseValidation.hashValitadionPhone
                }
            });

            const decryptedPhone = decryptData(responseValidation.numberPhone);
            const token = await generateJwt(userModified.uid);
            return { user: { ...userModified, numberPhone: decryptedPhone }, token };
        }
    } catch (error) {
        console.error("Error en validationCodePutAuthService:", error);
        throw new Error("Error en el servicio del código referenciado.");
    }
};

export { validationCodePostService, validationCodePostAuthService, validationCodePutAuthService };