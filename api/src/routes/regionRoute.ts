import { Router } from "express";
import { regionController } from "../controllers/regionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", regionController.getRegencies);
router.get("/:id", regionController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin"), regionController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), regionController.edit);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), regionController.deleteRegion);

export default router;
