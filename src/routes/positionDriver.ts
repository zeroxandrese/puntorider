import { Router } from "express";

import { positionDriverPostController, positionDriverDeleteController, positionDriverGetController } from "../controllers/positionDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.get("/", validarJWT, validarCampos, positionDriverGetController);

router.post("/", validarJWT, validarCampos, positionDriverPostController);

router.delete("/:id", [
    validarJWT,
    validarCampos
],positionDriverDeleteController);

export { router };