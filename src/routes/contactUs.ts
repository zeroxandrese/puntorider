import { Router } from "express";

import { contactUsPostController } from "../controllers/contactUs";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/", validarJWT, validarCampos, contactUsPostController);

export { router };