import { Router } from "express";
import { regionController } from "../controllers/regionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", regionController.getRegencies);
router.get("/admin", authMiddleware, authorizeRoles("Admin"), regionController.getAllRegionAdmin);
router.get("/:id", regionController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin"), regionController.create);
router.patch("/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), regionController.edit);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), regionController.deleteRegion);

export default router;
