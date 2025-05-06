import { Router } from "express";

import { contactUsPostController, contactDriverPostController } from "../controllers/contactUs";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/", validarJWT, validarCampos, contactUsPostController);

router.post("/driver", validarJWTDriver, validarCampos, contactDriverPostController);

export { router };