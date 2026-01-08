import { Router } from "express";
import { paymentController } from "../controllers/paymentController";


const router = Router();

router.post("/notification", paymentController.midtransNotification);

export default router;

