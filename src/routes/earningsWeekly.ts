import { Router } from "express";

import { getEarningsController } from "../controllers/generateWeeklyEarningsController";
import validarJWTDriver from "../middelware/validar-jwt-driver";

const router = Router();

router.get("/", validarJWTDriver, getEarningsController);

export { router };