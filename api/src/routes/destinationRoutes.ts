import { Router } from "express";
import { destinationController } from "../controllers/destinationController";


const router = Router();

router.get("/", destinationController.getDestinations);
router.get("/:id", destinationController.getDestinationById);
router.post("/", destinationController.addDestination)

export default router;