import { PrismaClient } from "@prisma/client";
import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
dotenv.config();


import { generateJwt } from '../helpers/generate-jwt';
import { UserClientCreate, UserClientUpdate, UserClientUID } from '../interface/interface';

const prisma = new PrismaClient

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

const usersClientPostService = async ({ numberPhone }: UserClientCreate) => {

    try {

        const userResponseService = await prisma.usersClient.create({
            data: {
                name: "Aliado",
                email: encryptData("default@example.com"),
                hashValidationEmail: encryptPhone("default@example.com"),
                numberPhone: encryptData(numberPhone),
                hashValidationPhone: encryptPhone(numberPhone),
            }
        });

        const referralCode = generateReferralCode(userResponseService.uid);

        await prisma.usersClient.update({
            where: { uid: userResponseService.uid },
            data: { referralCode },
        });

        const updatedUser = await prisma.usersClient.findFirst({
            where: { uid: userResponseService.uid }
        });

        let phone = ""

        if (updatedUser?.numberPhone) {
            phone = decryptData(updatedUser?.numberPhone)

        }

        const user = { ...updatedUser, numberPhone: phone };

        const token = await generateJwt(user.uid);

        return ({
            user,
            token
        })

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

const usersClientPutService = async ({ numberPhone, name, email, uid }: UserClientUpdate) => {

    try {

        if (!uid) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

        const userResponseService = await prisma.usersClient.update({
            where: { uid: uid },
            data: {
                name: name || "Aliado",
                email: encryptData(email) || "default@example.com",
                numberPhone: encryptData(numberPhone) || "0"
            }
        })

        let emailResponse = ""
        let phone = ""

        if (userResponseService?.email && userResponseService?.numberPhone) {
            emailResponse = decryptData(userResponseService?.email)
            phone = decryptData(userResponseService?.numberPhone)

        }

        const user = { ...userResponseService, email: emailResponse, numberPhone: phone };

        return user

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

const usersClientDeleteService = async ({ uid }: UserClientUID) => {

    try {

        if (!uid) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

        const userResponseService = await prisma.usersClient.update({
            where: { uid: uid },
            data: {
                status: false
            }
        })

        return userResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

export { usersClientPostService, usersClientPutService, usersClientDeleteService };