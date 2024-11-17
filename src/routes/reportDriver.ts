import { Router } from "express";
import { validarJWT } from "../middelware/validar-jwt";
import { countReportsController } from '../controllers/reportDriver';

const router = Router();

router.get('/', validarJWT, countReportsController);

export { router }; 