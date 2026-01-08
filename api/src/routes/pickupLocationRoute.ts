import { Router } from "express";
import { pickupLocationController } from "../controllers/pickupLocationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validate";
import { createPickupSchema, updatePickupSchema } from "../schemas/pickupSchema";

const router = Router();

// PUBLIC
router.get("/", pickupLocationController.getAllPickup);
router.get("/:id", pickupLocationController.getPickupById);

// ADMIN ONLY
router.post("/", authMiddleware, authorizeRoles("Admin"), validate(createPickupSchema), pickupLocationController.addPickup);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), validate(updatePickupSchema), pickupLocationController.updatePickupLocation);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), pickupLocationController.deletePickup);

export default router;
