import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../schemas/categorySchema";


const router = Router();

router.get("/", categoryController.getCategory);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authMiddleware, authorizeRoles("Admin"), validate(createCategorySchema), categoryController.createCategoty);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"),categoryController.deleteCategories);


export default router;