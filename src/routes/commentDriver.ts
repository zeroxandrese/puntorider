import { Router } from "express";
import { check } from 'express-validator';

import { commentDriverPostController, commentDriverPutController, commentDriverDeleteController, commentDriverGetController } from "../controllers/commentDriver";
import { validarCampos } from "../middelware/validar-campos";
import { findIdCommentDriver } from "../helpers/db-validators";
import validarJWTDriver from "../middelware/validar-jwt-driver";
import { findIdDriver } from "../helpers/db-validators";

const router = Router();

router.get("/:id", 
    validarJWTDriver,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdDriver),
    commentDriverGetController);

router.post("/", validarJWTDriver, validarCampos, commentDriverPostController);

router.put("/:id", [
    validarJWTDriver,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCommentDriver),
    validarCampos
],commentDriverPutController);

router.delete("/:id", [
    validarJWTDriver,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCommentDriver),
],commentDriverDeleteController);

export { router };