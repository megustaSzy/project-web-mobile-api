import { Router } from "express";
import { scheduleController } from "../controllers/scheduleController";

const router = Router();

router.get("/", scheduleController.getAllSchedules);

router.get("/:id", scheduleController.getScheduleById);

router.post("/", scheduleController.createSchedule);

router.put("/:id", scheduleController.editScheduleById);

router.delete("/:id", scheduleController.deleteScheduleById);

router.get("/search/filter", scheduleController.searchSchedule);



export default router;