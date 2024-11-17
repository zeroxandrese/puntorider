import { Router } from "express";

import { usersDriverController } from "../controllers/usersDriver";
import { validarCampos } from "../middelware/validar-campos";

const router = Router();

router.post("/", validarCampos, usersDriverController);

export { router };