import { PrismaClient } from "@prisma/client";
import * as bcryptjs from 'bcryptjs';
import CryptoJS from 'crypto-js';

import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwtDriver } from '../helpers/generate-jwt-driver';

import { UserClientUID, UserDriverUpdate, DriverUserPost } from '../interface/interface';


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


const usersDriverPostService = async ({ email, password }: DriverUserPost) => {

    try {

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const userResponseService = await prisma.usersDriver.create({
            data: {
                email: encryptData(email) || encryptData("default@example.com"),
                hashValidationEmail: encryptPhone(email),
                password: hashedPassword

            }
        })

        const { password: userPassword, ...sanitizedUser } = userResponseService;

        const token = await generateJwtDriver(userResponseService.uid);

        return ({ user: sanitizedUser, token })

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

const usersDriverPutService = async ({ numberPhone, name, lastName, email, uid }: UserDriverUpdate) => {

    try {

        if (!uid) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

        const userResponseService = await prisma.usersDriver.update({
            where: { uid: uid },
            data: {
                name: name || "Aliado",
                lastName,
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

const usersDriverDeleteService = async ({ uid }: UserClientUID) => {

    try {

        if (!uid) {
            throw new Error("El UID es obligatorio para actualizar un usuario.");
        }

        const userResponseService = await prisma.usersDriver.update({
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

export { usersDriverPostService, usersDriverPutService, usersDriverDeleteService };