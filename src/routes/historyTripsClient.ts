import { Router } from "express";

import { historyTripsClientGetController } from "../controllers/historyTripsClient";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", validarJWT, validarCampos, historyTripsClientGetController);

export { router };