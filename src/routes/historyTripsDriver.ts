import { Router } from "express";

import { historyTripsDriverGetController } from "../controllers/historyTripsDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", validarJWT, validarCampos, historyTripsDriverGetController);

export { router };