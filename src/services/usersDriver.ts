import { PrismaClient } from "@prisma/client";
import * as bcryptjs from 'bcryptjs';

import { generateJwt } from '../helpers/generate-jwt';
import { loginAuth } from '../interface/interface'

const prisma = new PrismaClient

const usersDriverPostService = async ({ name, password }: loginAuth) => {

    try {

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const newUser = await prisma.user.create({
            data:{
                Name: name,
                Password: hashedPassword
            }
        });

        const { Password: userPassword, ...sanitizedUser } = newUser;

        const token = await generateJwt(newUser.id);

        return ({
            user: sanitizedUser,
            token
        });

    } catch (err) {
        throw new Error("Error en el servicio del login");
        
    }
};

export { usersDriverPostService };