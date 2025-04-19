import { Router } from "express";

import { validarCampos } from "../middelware/validar-campos";
import { validationCodePostController, validationCodePostAuthController, validationCodePutAuthController } from "../controllers/validationCode";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

 router.post("/auth", validarCampos, validationCodePostAuthController);

 router.put("/authPut", validarJWT, validarCampos, validationCodePutAuthController);

router.post("/", validarCampos, validationCodePostController);

export { router };
