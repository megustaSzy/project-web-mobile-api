import { Router } from "express";
import { statController } from "../controllers/statController";


const router = Router();

router.get("/", statController.getStats);

export default router;