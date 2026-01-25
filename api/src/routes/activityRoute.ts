import { Router } from "express";
import { activityController } from "../controllers/activityController";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/admin", authMiddleware, authorizeRoles("Admin"), activityController.getAdminLogs);
router.get("/", authMiddleware, activityController.getUserLogs);

export default router;
