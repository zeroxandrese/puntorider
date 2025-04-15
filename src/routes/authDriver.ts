import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middelware/validar-campos";
import { loginDriverController, verifyTokenDriverController } from '../controllers/authDriver';
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/verify",
    validarJWTDriver
, verifyTokenDriverController);

router.post("/login", [
    check('email', 'El email es necesario').isEmail(),
    check('password', 'El password es necesario').not().isEmpty(),
    validarCampos
], loginDriverController);

export { router };