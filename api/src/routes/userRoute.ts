import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.get("/profile", authMiddleware, userController.getProfile);

router.get("/", authMiddleware, authorizeRoles("Admin"),userController.getAllUsers);

router.get("/:id", authMiddleware, userController.getUserById);

router.put("/:id", authMiddleware, userController.editUser);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), userController.deleteUser);


export default router;