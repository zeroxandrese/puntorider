import { Router } from "express";

import { vehiclesGetController } from "../controllers/vehicles";
import { validarCampos } from "../middelware/validar-campos";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.get("/", validarJWTDriver, vehiclesGetController);

export { router };