import { Router } from "express";

import { usersClientPostController, usersClientPutController, usersClientDeleteController } from "../controllers/usersClient";
import { validarCampos } from "../middelware/validar-campos";
import idValidator from "../helpers/id-validator";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, usersClientPostController);

router.put("/", [
    validarJWT,
    idValidator,
    validarCampos
],usersClientPutController);

router.delete("/", [
    validarJWT,
    idValidator,
    validarCampos
],usersClientDeleteController);

export { router };