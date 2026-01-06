import { Router } from "express";
import { regionController } from "../controllers/regionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validate";
import { createRegionSchema, updateRegionSchema } from "../schemas/regionSchema";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", regionController.getRegencies);
router.get("/:id", regionController.getById);
router.post("/", authMiddleware, authorizeRoles("Admin"), validate(createRegionSchema), regionController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(updateRegionSchema), regionController.edit);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), regionController.deleteRegion);

export default router;
