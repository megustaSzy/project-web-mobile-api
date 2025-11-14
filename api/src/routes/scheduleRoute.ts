import { Router } from "express";
import { scheduleController } from "../controllers/scheduleController";

const router = Router();

router.get("/", scheduleController.getAllSchedules)



export default router;