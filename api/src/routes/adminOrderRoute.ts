import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminOrderController } from "../controllers/adminOrderController";



const router = Router();


router.get("/", authMiddleware, adminOrderController.getAllOrders);

router.get("/:id", authMiddleware, adminOrderController.getAllOrderById);

router.delete("/:id", authMiddleware, adminOrderController.deleteOrderById);


export default router