import { Router } from "express";
import { scheduleController } from "../controllers/scheduleController";

const router = Router();

router.get("/", scheduleController.getAllSchedules);

router.get("/:id", scheduleController.getScheduleById);




export default router;