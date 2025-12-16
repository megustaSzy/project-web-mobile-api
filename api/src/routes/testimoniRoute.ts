import { Router } from "express";
import { testimoniController } from "../controllers/testimoniController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

// tampil di website (hanya APPROVED)
router.get("/", testimoniController.getApproved);
router.get("/:id", testimoniController.getById);

router.post("/", testimoniController.create);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), testimoniController.delete ); 

router.get("/admin", authMiddleware, authorizeRoles("Admin"), testimoniController.getAll);

router.get("/admin/pending", authMiddleware, authorizeRoles("Admin"), testimoniController.getPending);

router.put("/:id", authMiddleware, authorizeRoles("Admin"), testimoniController.edit);  // user pemilik testimoni

router.patch("/admin/:id/approve", authMiddleware, authorizeRoles("Admin"), testimoniController.approve);

router.patch("/admin/:id/reject", authMiddleware, authorizeRoles("Admin"), testimoniController.reject);


export default router;
