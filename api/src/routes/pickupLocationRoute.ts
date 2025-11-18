import { Router } from "express";
import { pickupLocationController } from "../controllers/pickupLocationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

// PUBLIC
router.get("/", pickupLocationController.getAllPickup);
router.get("/:id", pickupLocationController.getPickupById);

// ADMIN ONLY
router.post("/", authMiddleware, authorizeRoles("Admin"), pickupLocationController.addPickup);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), pickupLocationController.updatePickupLocation);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), pickupLocationController.deletePickup);

export default router;
