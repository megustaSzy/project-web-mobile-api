import { Router } from "express";
import { teamController } from "../controllers/teamController";

const router = Router();

router.get("/", teamController.getTeam);

export default router;