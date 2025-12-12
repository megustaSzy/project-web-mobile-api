import { Router } from "express";
import { regionController } from "../controllers/regionController";

const router = Router();

router.get("/regencies/:id", regionController.getRegenciesByProvinsi);

export default router;
