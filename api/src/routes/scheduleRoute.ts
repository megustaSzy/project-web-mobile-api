import { Router } from "express";
import { scheduleController } from "../controllers/scheduleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

// PUBLIC
router.get("/", scheduleController.getAllSchedules);
router.get("/search/filter", scheduleController.searchSchedule);
router.get("/:id", scheduleController.getScheduleById);

// ADMIN ONLY
router.post("/", authMiddleware, authorizeRoles("Admin"), scheduleController.createSchedule);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), scheduleController.editScheduleById);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), scheduleController.deleteScheduleById);

export default router;
