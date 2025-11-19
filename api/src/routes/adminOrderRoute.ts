import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { adminOrderController } from "../controllers/adminOrderController";

const router = Router();

// ADMIN ONLY
router.get("/", authMiddleware, authorizeRoles("Admin"), adminOrderController.getAllOrders);

router.get("/:id", authMiddleware, authorizeRoles("Admin"), adminOrderController.getOrderById);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), adminOrderController.deleteOrderById);

export default router;
