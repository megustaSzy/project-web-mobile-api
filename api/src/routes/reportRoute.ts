import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/sales", authMiddleware, authorizeRoles("Admin"), reportController.sales);
router.get("/sales/excel", authMiddleware, authorizeRoles("Admin"), reportController.downloadExcel);
router.get("/sales/pdf", authMiddleware, authorizeRoles("Admin"), reportController.downloadPdf);

export default router;
