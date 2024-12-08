import { Router } from "express";
import { check } from 'express-validator';

import { commentClientPostController, commentClientPutController, commentClientDeleteController, commentClientGetController } from "../controllers/commentClient";
import { validarCampos } from "../middelware/validar-campos";
import { findIdCommentClient } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";
import { findIdClient } from "../helpers/db-validators";

const router = Router();

router.get("/:id", 
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdClient),
    commentClientGetController);

router.post("/", validarJWT, validarCampos, commentClientPostController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCommentClient),
    validarCampos
],commentClientPutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCommentClient),
    validarCampos
],commentClientDeleteController);

export { router };