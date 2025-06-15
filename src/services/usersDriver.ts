import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import * as bcryptjs from 'bcryptjs';
import CryptoJS from 'crypto-js';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwtDriver } from '../helpers/generate-jwt-driver';

import { UserClientUID, UserDriverUpdate, DriverUserPost, genericIdProps, userDriver } from '../interface/interface';

export interface PutAvatarParams {
    uid: string;
    file: Express.Multer.File;
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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


const usersDriverGetService = async ({ id }: genericIdProps) => {

    try {

        const userResponseService = await prisma.usersDriver.findFirst({
            where: { uid: id, status: true }
        });

        if (!userResponseService) {
            console.error("No hay user.");
            return {
                message: "No hay user."
            };
        }


        const emailResponse = userResponseService.email ? decryptData(userResponseService.email) : null;
        const phone = userResponseService.numberPhone ? decryptData(userResponseService.numberPhone) : null;

        const user = { ...userResponseService, email: emailResponse, numberPhone: phone };

        return user

    } catch (err) {
        throw new Error("Error en el servicio del user");

    }
};

const usersDriverPostService = async ({ email, password, code }: DriverUserPost) => {

    try {

        const validationCode = await prisma.codeRegisterDriver.findFirst({
            where: { code, status: true }
        });

        if (!validationCode) {
            console.error("No hay codigo de validación.");
            return {
                message: "No hay codigo de validación."
            };
        }

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

const usersDriverPutAvatarService = async ({ file, uid }: PutAvatarParams) => {
    try {

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: 'avatars',
            public_id: uid,
            overwrite: true,
        });

        // delete temp files
        fs.unlinkSync(file.path);

        // update driver
        const updated = await prisma.usersDriver.update({
            where: { uid },
            data: { img: uploadResult.secure_url }
        });

        return updated;

    } catch (err: any) {
        console.error('Error subiendo avatar:', err);
        throw new Error("Error interno al subir avatar");
    }
}

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

export { usersDriverPostService, usersDriverPutService, usersDriverDeleteService, usersDriverGetService, usersDriverPutAvatarService };