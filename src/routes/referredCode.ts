import { Router } from "express";

import { referredCodeGetController, referredCodePostController } from "../controllers/referredCode";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", validarJWT, validarCampos, referredCodeGetController);

router.post("/", 
    validarJWT,
    validarCampos, 
    referredCodePostController);

export { router };