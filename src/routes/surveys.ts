import { Router } from "express";
import { check } from 'express-validator';

import { validarCampos } from "../middelware/validar-campos";
import { surveysClientsPostController, surveysDriversPostController } from "../controllers/surveys";
import validarJWT from "../middelware/validar-jwt";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.post("/clientsSurveys/:id",
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    surveysClientsPostController);

router.post("/driversSurveys/:id",
    validarJWTDriver,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    surveysDriversPostController);

export { router };