import { Router } from "express";
import { validarJWT } from "../middelware/validar-jwt";
import { countCommentsController } from '../controllers/comments';

const router = Router();

router.get('/', validarJWT, countCommentsController);

export { router }; 