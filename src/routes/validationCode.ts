import { Router } from "express";

import { validarCampos } from "../middelware/validar-campos";
import { validationCodePostController, validationCodePostAuthController } from "../controllers/validationCode";

const router = Router();

 router.post("/auth", validarCampos, validationCodePostAuthController);

router.post("/", validarCampos, validationCodePostController);

export { router };
