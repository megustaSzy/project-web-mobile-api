import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authController } from "../controllers/authController";


const router = Router();


router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));


export default router;