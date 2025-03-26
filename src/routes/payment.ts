import { Router } from 'express';

import { paymentPostController } from "../controllers/payment";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get('/createOrder',
paymentPostController);



export { router };