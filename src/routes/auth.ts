import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middelware/validar-campos";
import { googleLoginController, verifyTokenController } from '../controllers/auth';
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/verify",
    validarJWT
, verifyTokenController);

//Ruta no funcional comentando por (ANDRES)
/* router.post("/login", [
    check('numberPhone', 'El numberPhone debe de tener al menos 11 digitos').isLength({ min: 11 }).not().isEmpty(),
    validarCampos
], loginController); */

router.post("/login/google", [
    check('googleToken', 'El Token es obligatorio').not().isEmpty(),
    validarCampos
], googleLoginController);

export { router };