import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middelware/validar-campos";
import { loginDriverController, verifyTokenDriverController } from '../controllers/authDriver';
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/verify",
    validarJWT
, verifyTokenDriverController);

router.post("/login", [
    check('email', 'El email es necesario').isEmail(),
    check('password', 'El password es necesario').not().isEmpty(),
    validarCampos
], loginDriverController);

export { router };