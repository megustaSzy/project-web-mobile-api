import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

// User melihat profil sendiri
router.get("/profile", authMiddleware, userController.getProfile);

// Khusus admin: list semua user
router.get("/", authMiddleware, authorizeRoles("Admin"), userController.getAllUsers);

// Admin & user bisa melihat user tertentu
router.get("/:id", authMiddleware, userController.getUserById);

// Edit user (admin atau user itu sendiri — cek di controller)
router.put("/:id", authMiddleware, userController.editUser);

// Hapus user (admin only)
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), userController.deleteUser);

export default router;
