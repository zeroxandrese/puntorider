import { Router } from "express";

import { calculateEarningsController } from '../controllers/generateWeeklyEarningsController';

const router = Router();

router.post("/", calculateEarningsController);

export { router };