import { Router } from "express";
import { testimoniController } from "../controllers/testimoniController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();


router.get("/", testimoniController.getApproved);
router.post("/", testimoniController.create);

router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("Admin"),
  testimoniController.getAll
);
router.get(
  "/admin/pending",
  authMiddleware,
  authorizeRoles("Admin"),
  testimoniController.getPending
);

// Admin approve/reject
router.patch(
  "/admin/:id/approve",
  authMiddleware,
  authorizeRoles("Admin"),
  testimoniController.approve
);
router.patch(
  "/admin/:id/reject",
  authMiddleware,
  authorizeRoles("Admin"),
  testimoniController.reject
);

// Route dinamis harus di paling bawah
router.get("/:id", testimoniController.getById);

// Admin edit / delete testimoni
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  testimoniController.edit
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  testimoniController.delete
);

export default router;
