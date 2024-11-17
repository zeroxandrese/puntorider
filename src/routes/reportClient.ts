import { Router } from "express";
import { validarJWT } from "../middelware/validar-jwt";
import { countReportsController } from '../controllers/reportClient';

const router = Router();

router.get('/', validarJWT, countReportsController);

export { router }; 