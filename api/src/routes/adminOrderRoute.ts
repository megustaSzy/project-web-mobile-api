import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { adminOrderController } from "../controllers/adminOrderController";
import { validate } from "../middlewares/validate";
import { createAdminOrderSchema } from "../schemas/createAdminOrderSchema";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("Admin"), validate(createAdminOrderSchema), adminOrderController.createOrder);

router.get("/", authMiddleware, authorizeRoles("Admin"), adminOrderController.getAllOrders);

router.get("/:id", authMiddleware, authorizeRoles("Admin"), adminOrderController.getOrderById);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), adminOrderController.deleteOrderById);

export default router;
