import { Router } from "express";

import { cancelTripClientPostController, cancelTripDriverPostController } from "../controllers/cancelTrip";
import validarJWT from "../middelware/validar-jwt";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/clientCancelTrip/:id", validarJWT, cancelTripClientPostController);

router.post("/driverCancelTrip/:id", validarJWTDriver, cancelTripDriverPostController);

export { router };