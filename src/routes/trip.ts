import { Router } from "express";
import { check } from 'express-validator';

import { tripPostController, tripPutController, tripDeleteController, tripGetController, tripAcceptController } from "../controllers/trip";
import { validarCampos } from "../middelware/validar-campos";
import { findTrip } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", [
    validarJWT
], tripGetController)

router.post("/", validarJWT, tripPostController);

router.post("/driverAccepted/:id", validarJWT, tripAcceptController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findTrip),
    validarCampos
],tripPutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findTrip),
    validarCampos
],tripDeleteController);

export { router };