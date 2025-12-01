import { Router } from "express";
import { destinationController } from "../controllers/destinationController";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", destinationController.getDestinations);
router.get("/:id", destinationController.getDestinationById);

router.post("/", authMiddleware, authorizeRoles("Admin"), upload.single("image"), destinationController.addDestination);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), destinationController.updateDestination);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), destinationController.deleteDestination);

export default router;
