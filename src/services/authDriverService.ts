import * as bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';

import { UIDObject, PropsLoginDriver } from '../interface/interface'

import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwtDriver } from '../helpers/generate-jwt-driver';
import { clearAllRedisKeys } from '../utils/deleteKeyRedis';

const encryptData = (data: string | number) => {
    return CryptoJS.AES.encrypt(data.toString(), process.env.secretKeyCrypto!).toString();
};

const encryptEmail = (phone: string | number) => {
    return CryptoJS.HmacSHA224(phone.toString(), process.env.secretKeyCrypto!).toString();
};

const decryptData = (encryptedPhone: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPhone, process.env.secretKeyCrypto!);
    return bytes.toString(CryptoJS.enc.Utf8);
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

        const token = await generateJwtDriver(uid.uid);

        return {
            user,
            token
        };

    } catch (error) {
        throw new Error('Algo salio mal, contacte con el administrador')
    }
};


const loginDriver = async ({ email, password }: PropsLoginDriver) => {

    try {
console.log(email)
console.log(password)
        const emailEncrypt = encryptEmail(email)
console.log(emailEncrypt)
        const userResponse = await prisma.usersDriver.findFirst({
            where: { hashValidationEmail: emailEncrypt }
        });
console.log(userResponse,"userResponse")
console.log(!userResponse,"userResponse !")
        if (!userResponse) {
            throw new Error("The user is incorrect")
        }

        //Validacion usuario activo
        if (!userResponse.status) {
            throw new Error("User disable")
        }

        const findPassword = await bcryptjs.compareSync(password, userResponse!.password);
        if (!findPassword) {
            throw new Error("El email / Password son incorrectos")

        }
console.log(findPassword,"userResponse !")
        //Generar JWT
        const token = await generateJwtDriver(userResponse.uid);

        let emailDecrypt = ""
        let phoneDecrypt = ""

        if (userResponse?.email && userResponse?.numberPhone) {
            emailDecrypt = decryptData(userResponse?.email)
            phoneDecrypt = decryptData(userResponse?.numberPhone)
            
        }

        const user = { ...userResponse, email: emailDecrypt, numberPhone: phoneDecrypt };

        return {
            user,
            token
        };


    } catch (err) {
        throw new Error('Algo salio mal, contacte con el administrador');
    }
};

export {
    loginDriver,
    verifyToken
}