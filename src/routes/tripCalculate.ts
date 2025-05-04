import { Router } from "express";
import { check } from 'express-validator';

import { tripCalculatePostController, tripCalculatePutController, tripCalculateDeleteController } from "../controllers/tripCalculate";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, tripCalculatePostController);

router.put("/:id",
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos, tripCalculatePutController);

router.delete("/:id",
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos, tripCalculateDeleteController);

export { router };