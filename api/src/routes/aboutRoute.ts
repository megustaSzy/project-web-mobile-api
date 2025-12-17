import { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { valueController } from "../controllers/valueController";
import { upload } from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validate";
import { createAboutSchema, updateAboutSchema } from "../schemas/aboutSchema";


const router = Router();


router.get("/", aboutController.getAbout);
router.get("/value", valueController.getAll);

router.post("/", authMiddleware, authorizeRoles("Admin"), validate(createAboutSchema), aboutController.createAbout);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), validate(updateAboutSchema), aboutController.updateAbout);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), aboutController.deleteAbout);

router.get("/value/:id", authMiddleware, authorizeRoles("Admin"), valueController.getValueById);
router.post("/value", authMiddleware, authorizeRoles("Admin"), upload.single("image"), valueController.createValue);
router.put("/value/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), valueController.editById);
router.delete("/value/:id", authMiddleware, authorizeRoles("Admin"), valueController.deleteById);



export default router;