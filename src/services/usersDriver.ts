import { PrismaClient } from "@prisma/client";
import * as bcryptjs from 'bcryptjs';

import { generateJwt } from '../helpers/generate-jwt';

import { UserClientUID, UserDriverUpdate, DriverUserPost } from '../interface/interface'

const prisma = new PrismaClient

const encryptPhone = (phone: string) => {
    return CryptoJS.AES.encrypt(phone.toString(), process.env.secretKeyCrypto!).toString();
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
                email: encryptPhone(email) || "default@example.com",
                password: hashedPassword
                
            }
        })

        const { password: userPassword, ...sanitizedUser } = userResponseService;

        const token = await generateJwt(userResponseService.uid);

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
                email: encryptPhone(email) || "default@example.com",
                numberPhone: encryptPhone(numberPhone) || "0"
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
                status : false
            }
        })

        return userResponseService

    } catch (err) {
        throw new Error("Error en el servicio del user");
        
    }
};

export { usersDriverPostService, usersDriverPutService, usersDriverDeleteService };