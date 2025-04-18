import { PrismaClient } from "@prisma/client";
import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
dotenv.config();


import { generateJwt } from '../helpers/generate-jwt';
import { UserClientCreate, UserClientUpdate, UserClientUID } from '../interface/interface';

const prisma = new PrismaClient

const decryptData = (encryptedPhone: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPhone, process.env.secretKeyCrypto!);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptData = (data: string | number) => {
    return CryptoJS.AES.encrypt(data.toString(), process.env.secretKeyCrypto!).toString();
};

const usersClientPostService = async ({ numberPhone }: UserClientCreate) => {

    try {

       const userResponseService = await prisma.usersClient.create({
            data: {
                name: "Aliado",
                email: "default@example.com",
                numberPhone: encryptData(numberPhone)
            }
        })

        let phone = ""

        if (userResponseService?.numberPhone) {
            phone = decryptData(userResponseService?.numberPhone)
            
        }

        const user = { ...userResponseService, numberPhone: phone };

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
                status : false
            }
        })

        return userResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

export { usersClientPostService, usersClientPutService, usersClientDeleteService };