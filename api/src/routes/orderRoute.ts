import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, orderController.createOrder);
router.get("/me", authMiddleware, orderController.getMyOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);

router.get("/:id/ticket", authMiddleware, orderController.getTicketDetail);
router.get("/:id/ticket/pdf", authMiddleware, orderController.getTicketPDF);

export default router;
