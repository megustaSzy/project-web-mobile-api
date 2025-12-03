import { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { valueController } from "../controllers/valueController";


const router = Router();


router.get("/", aboutController.getAbout);
router.get("/value", valueController.getAll);

router.post("/", authMiddleware, authorizeRoles("Admin"), aboutController.createAbout);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), aboutController.updateAbout);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), aboutController.deleteAbout);

router.get("/value/:id", authMiddleware, authorizeRoles("Admin"), valueController.getValueById);
router.post("/value", authMiddleware, authorizeRoles("Admin"), valueController.createValue);
router.put("/value/:id", authMiddleware, authorizeRoles("Admin"), valueController.editById);
router.delete("/value/:id", authMiddleware, authorizeRoles("Admin"), valueController.deleteById);



export default router;