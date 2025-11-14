import { Router } from "express";
import { destinationController } from "../controllers/destinationController";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();


// get public
router.get("/", destinationController.getDestinations);
router.get("/:id", destinationController.getDestinationById);

//khusus admin
router.post("/", authMiddleware, authorizeRoles("Admin"), destinationController.addDestination);
router.put("/:id", authMiddleware, authorizeRoles("Admin"),destinationController.updateDestination);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"),destinationController.deleteDestination)

export default router;