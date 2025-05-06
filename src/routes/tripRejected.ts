import { Router } from "express";
import { check } from "express-validator";

import { tripRejectedController } from '../controllers/tripRejected';
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/:id",
    check('id', 'El id no es valido').isMongoId(),
    validarJWTDriver
, tripRejectedController);

export { router };