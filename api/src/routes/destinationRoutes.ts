import { Router } from "express";
import { destinationController } from "../controllers/destinationController";


const router = Router();

router.get("/", destinationController.getDestinations);
router.get("/:id", destinationController.getDestinationById);
router.post("/", destinationController.addDestination);
router.put("/:id", destinationController.updateDestination);
router.delete("/id", destinationController.deleteDestination)

export default router;