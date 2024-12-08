import { Router } from "express";

import { reportClientPostController } from "../controllers/reportClient";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, reportClientPostController);

export { router };