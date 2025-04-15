import { Router } from "express";

import { usersDriverPostController, usersDriverPutController, usersDriverDeleteController } from "../controllers/usersDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/", validarCampos, usersDriverPostController);

router.put("/", [
    validarJWTDriver,
    validarCampos
],usersDriverPutController);

router.delete("/", [
    validarJWTDriver,
    validarCampos
],usersDriverDeleteController);

export { router };