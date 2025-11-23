import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Create order
router.post("/", authMiddleware, orderController.createOrder);

// Get orders for logged-in user
router.get("/me", authMiddleware, orderController.getMyOrders);

router.get("/:id", authMiddleware, orderController.getOrderById);

export default router;
