import { Router } from "express";

import { reportDriverController } from "../controllers/reportDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, reportDriverController);

export { router };