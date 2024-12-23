import * as bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';

import { UIDObject, PropsLoginDriver } from '../interface/interface'

import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwt } from '../helpers/generate-jwt';

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


const loginDriver = async ({ email, password }: PropsLoginDriver) => {

    try {
        const emailEncrypt = encryptData(email)

        const userResponse = await prisma.usersDriver.findFirst({
            where: { email: emailEncrypt }
        });

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

        //Generar JWT
        const token = await generateJwt(userResponse.uid);

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