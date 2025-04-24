import { Router } from "express";
import { check } from 'express-validator';

import {
    tripPostController, tripPutController,
    tripDeleteController, tripGetController,
    tripAcceptController, tripDriverArrivedController,
    startTripAndUpdateRouteController
} from "../controllers/trip";
import { validarCampos } from "../middelware/validar-campos";
import { findTrip } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.get("/", [
    validarJWT
], tripGetController)

router.post("/", validarJWT, tripPostController);

router.post("/driverAccepted/:id", validarJWTDriver, tripAcceptController);

router.post("/driverArrived/:id", validarJWTDriver, tripDriverArrivedController);

router.post("/tripStarted/:id", validarJWTDriver, startTripAndUpdateRouteController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findTrip),
    validarCampos
], tripPutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findTrip),
    validarCampos
], tripDeleteController);

export { router };