import { Router } from "express";
import { destinationController } from "../controllers/destinationController";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validate";
import { createAdminOrderSchema } from "../schemas/createAdminOrderSchema";
import { updateDestinationSchema } from "../schemas/destinationSchema";

const router = Router();

router.get("/", destinationController.getDestinations);
router.get("/:id", destinationController.getDestinationById);

router.post("/", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(createAdminOrderSchema), destinationController.addDestination);
router.patch("/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(updateDestinationSchema), destinationController.updateDestination);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), destinationController.deleteDestination);

export default router;
