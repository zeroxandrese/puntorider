import { Router } from "express";
import { check } from 'express-validator';

import { usersClientPostController, usersClientPutController, usersClientDeleteController } from "../controllers/usersClient";
import { validarCampos } from "../middelware/validar-campos";
import { findScheduledTrip } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/:id", validarJWT, validarCampos, usersClientPostController);

router.post("/", validarJWT, validarCampos, usersClientPostController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findScheduledTrip),
    validarCampos
],usersClientPutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findScheduledTrip),
    validarCampos
],usersClientDeleteController);

export { router };