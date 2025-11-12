import { Router } from "express";
import { destinationController } from "../controllers/destinationController";


const router = Router();

router.get("/", destinationController.getDestination)

export default router;