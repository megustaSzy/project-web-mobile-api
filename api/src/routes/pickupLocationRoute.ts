import { Router } from "express";
import { pickupLocationController } from "../controllers/pickupLocationController";

const router = Router();


router.get("/", pickupLocationController.getAllPickup);
router.get("/:id", pickupLocationController.getPickupById);
router.post("/", pickupLocationController.addPickup);
router.put("/:id", pickupLocationController.updatePickupLocation);
router.delete("/:id", pickupLocationController.deletePickup);

export default router;