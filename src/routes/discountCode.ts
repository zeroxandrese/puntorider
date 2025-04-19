import { Router } from "express";
import { check } from 'express-validator';

import { discountCodePostController, discountCodePutController, discountCodeDeleteController, discountCodeGetController } from "../controllers/discountCode";
import { validarCampos } from "../middelware/validar-campos";
import { findIdClient } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/",
    validarJWT,
    discountCodeGetController);

/* router.post("/", validarJWT, validarCampos, discountCodePostController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdClient),
    validarCampos
], discountCodePutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdClient),
    validarCampos
], discountCodeDeleteController); */

export { router };