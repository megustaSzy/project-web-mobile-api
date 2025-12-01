import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";


const router = Router();

router.get("/", categoryController.getCategory);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authMiddleware, authorizeRoles("Admin"), categoryController.createCategoty);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), categoryController.updateCategory);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"),categoryController.deleteCategories)


export default router;