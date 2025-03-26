import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

import { generateJwt } from '../helpers/generate-jwt';
import { phoneNumberProps, validationCodeProps } from '../interface/interface';

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
/*             await client.messages.create({
                body: `Hola, usa este código para continuar en Puntoride: ${code}. ¡Gracias por elegirnos!`,
                to: `+51${phoneNumber}`,
                from: '+19896583157',
            }); */
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

        console.log("Código guardado:", validationCodeResponseService);

        return { codeValidationNumberSecurity: validationCodeResponseService.codeSecurity };

    } catch (err) {
        console.error("Error en validationCodePostService:", err);
        throw new Error("Error en el servicio del código de validación.");
    }
};

const validationCodePostAuthService = async ({ code, codeSecurity }: validationCodeProps) => {

    try {
        if (!code || !codeSecurity) {
            return { error:"El código y el código de seguridad son obligatorios."};
        }

        const responseValidation = await prisma.validationCodeSMS.findFirst({
            where: { code, codeSecurity }
        });

        if (!responseValidation) {
            return { error: "Código no válido para el usuario." };

        }

        let user = await prisma.usersClient.findFirst({
            where: { hashValitadionPhone: responseValidation.hashValitadionPhone }
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
                email: "default@example.com",
                numberPhone: responseValidation.numberPhone,
                hashValitadionPhone: responseValidation.hashValitadionPhone
            }
        });

        if (newUser.numberPhone) {
            const decryptedPhone = decryptData(newUser.numberPhone);
            const token = await generateJwt(newUser.uid);

            return {
                user: { ...newUser, numberPhone: decryptedPhone },
                token
            };
        }

    } catch (error) {
        console.error("Error en validationCodePostAuthService:", error);
        throw new Error("Error en el servicio del código referenciado.");
    }
};

export { validationCodePostService, validationCodePostAuthService };