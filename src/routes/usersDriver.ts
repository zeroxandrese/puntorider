import { Router } from "express";
import multer from 'multer';

const upload = multer();

import { usersDriverPostController, usersDriverPutController, usersDriverDeleteController, 
    usersDriverGetController, usersDriverPutAvatarController } from "../controllers/usersDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/", validarCampos, usersDriverPostController);

router.get("/", validarJWTDriver, usersDriverGetController);

router.put("/", [
    validarJWTDriver,
    validarCampos
],usersDriverPutController);

router.put("/avatar", [
    validarJWTDriver,
    upload.single('file')
],usersDriverPutAvatarController);

router.delete("/", [
    validarJWTDriver,
    validarCampos
],usersDriverDeleteController);

export { router };