import { Router } from "express";

import { historyTripsDriverGetController } from "../controllers/historyTripsDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.get("/", validarJWTDriver, validarCampos, historyTripsDriverGetController);

export { router };