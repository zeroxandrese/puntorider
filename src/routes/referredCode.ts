import { Router } from "express";
import { check } from 'express-validator';

import { referredCodeGetController, referredCodePostController } from "../controllers/referredCode";
import { validarCampos } from "../middelware/validar-campos";
import { findIdClient } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", validarJWT, validarCampos, referredCodeGetController);

router.post("/:id", 
    validarJWT, 
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdClient),
    validarCampos, 
    referredCodePostController);

export { router };