import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.get("/", authMiddleware, authorizeRoles("Admin"), asyncHandler(userController.getAllUsers));
router.get("/:id", authMiddleware, asyncHandler(userController.getUserById));
router.put("/:id", authMiddleware, asyncHandler(userController.editUser));
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), asyncHandler(userController.deleteUser))


export default router;