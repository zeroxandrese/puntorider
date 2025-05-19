import { Router } from "express";


import { driverPostLocationController } from "../controllers/driverLocation";
import { validarCampos } from "../middelware/validar-campos";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/location", validarJWTDriver, validarCampos, driverPostLocationController);

export { router };