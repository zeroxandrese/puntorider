import { Router } from "express";

import { tripCalculatePostController } from "../controllers/tripCalculate";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, tripCalculatePostController);

export { router };