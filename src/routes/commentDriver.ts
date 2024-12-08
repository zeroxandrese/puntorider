import { Router } from "express";
import { check } from 'express-validator';

import { commentDriverPostController, commentDriverPutController, commentDriverDeleteController, commentDriverGetController } from "../controllers/commentDriver";
import { validarCampos } from "../middelware/validar-campos";
import { findIdCommentDriver } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";
import { findIdDriver } from "../helpers/db-validators";

const router = Router();

router.get("/:id", 
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdDriver),
    commentDriverGetController);

router.post("/", validarJWT, validarCampos, commentDriverPostController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCommentDriver),
    validarCampos
],commentDriverPutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCommentDriver),
],commentDriverDeleteController);

export { router };