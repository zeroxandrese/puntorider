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

  const emailEncrypt = encryptEmail(email);
  const userResponse = await prisma.usersDriver.findFirst({
    where: { hashValidationEmail: emailEncrypt },
    select: {
      uid: true,
      password: true,
      status: true,
      email: true,
      numberPhone: true,
      vehicleType: true,
    },
  });

  if (!userResponse) {
    throw new Error("Email o contraseña incorrectos");
  }

  // 2) Usuario activo?
  if (!userResponse.status) {
    throw new Error("Usuario deshabilitado"); 
  }
  console.log("hash almacenado:", userResponse.password);

  // 3) Comparar contraseña (asíncrona)
  const isMatch = await bcryptjs.compare(password, userResponse.password);
  console.log("¿Coincide la contraseña?", isMatch);

  if (!isMatch) {
    throw new Error("Email o contraseña incorrectos");
  }

  // 4) Generar token
  const token = await generateJwtDriver(userResponse.uid);

  // 5) Devolver datos desencriptados
  const emailDecrypt   = userResponse.email       ? decryptData(userResponse.email)       : "";
  const phoneDecrypt   = userResponse.numberPhone ? decryptData(userResponse.numberPhone) : "";

  return {
    user: {
      uid: userResponse.uid,
      email: emailDecrypt,
      numberPhone: phoneDecrypt,
      vehicleType: userResponse.vehicleType,
    },
    token,
  };
};

export {
    loginDriver,
    verifyToken
}