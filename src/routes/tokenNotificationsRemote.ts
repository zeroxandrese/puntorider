import { Router } from "express";

import { validarCampos } from "../middelware/validar-campos";
import { tokenNotificationsRemotePostController } from "../controllers/tokenNotificationsRemote";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.post("/",
    validarJWT,
    validarCampos,
    tokenNotificationsRemotePostController);

export { router };