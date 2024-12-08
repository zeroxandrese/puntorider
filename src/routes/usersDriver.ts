import { Router } from "express";

import { usersDriverPostController, usersDriverPutController, usersDriverDeleteController } from "../controllers/usersDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, usersDriverPostController);

router.put("/", [
    validarJWT,
    validarCampos
],usersDriverPutController);

router.delete("/", [
    validarJWT,
    validarCampos
],usersDriverDeleteController);

export { router };