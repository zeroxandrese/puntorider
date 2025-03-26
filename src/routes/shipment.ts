import { Router } from "express";
import { check } from 'express-validator';

import { shipmentPostController, shipmentPutController, shipmentDeleteController, shipmentGetController } from "../controllers/shipment";
import { validarCampos } from "../middelware/validar-campos";
import { findShipment } from "../helpers/db-validators";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", validarJWT, shipmentGetController);

router.post("/", validarJWT, validarCampos, shipmentPostController);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findShipment),
    validarCampos
],shipmentPutController);

router.delete("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findShipment),
    validarCampos
],shipmentDeleteController);

export { router };