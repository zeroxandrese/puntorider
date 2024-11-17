import { Router } from "express";

import { authController } from "../controllers/auth";
import { validarCampos } from "../middelware/validar-campos";

const router = Router();

router.post("/", validarCampos, authController);

export { router };