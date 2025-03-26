import { Router } from 'express';
import { check } from 'express-validator';

import { findNotificationsDriver } from '../helpers/db-validators';
import { notificationsDriverPutController } from "../controllers/notificationDriver";
import { validarCampos } from "../middelware/validar-campos";
import validarJWT from "../middelware/validar-jwt";

const router = Router();

router.put('/:id', [
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findNotificationsDriver),
    validarCampos
],notificationsDriverPutController);



export { router };