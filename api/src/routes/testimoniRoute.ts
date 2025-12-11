import { Router } from "express";
import { testimoniController } from "../controllers/testimoniController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", testimoniController.getAll);

router.get("/:id", testimoniController.getById);

router.post("/", authMiddleware, testimoniController.create);

router.put("/:id", authMiddleware, authorizeRoles("Admin"), testimoniController.edit);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), testimoniController.delete);

export default router;