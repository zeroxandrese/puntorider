import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from "../middelware/validar-campos";
import { notificationsClientPutController } from "../controllers/notificationClient";
import validarJWT from "../middelware/validar-jwt";
import { findNotificationsClient } from '../helpers/db-validators';

const router = Router();

router.put('/:id', [
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findNotificationsClient),
    validarCampos
],notificationsClientPutController);



export default router;