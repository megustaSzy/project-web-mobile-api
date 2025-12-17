import { Router } from "express";
// import { asyncHandler } from "../middlewares/asyncHandler";
import passport from "../config/passport";
import { authController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../schemas/authSchema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", authController.login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), authController.googleCallback);

router.post("/refresh", authController.refreshToken);

router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);
router.get("/verify-reset", authController.verifyResetSession);
router.post("/reset-password", authController.resetPassword);

export default router;
