import { Router } from "express";
import { check } from 'express-validator';

import { favoritePlacePostController, favoritePlaceDeleteController, favoritePlaceGetController } from "../controllers/favoritePlace";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";
import { findIdFavoritePlace, findIdClient } from "../helpers/db-validators";

const router = Router();

router.get("/:id", 
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdClient),
    favoritePlaceGetController);

router.post("/", validarJWT, validarCampos, favoritePlacePostController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdFavoritePlace),
],favoritePlaceDeleteController);

export { router };