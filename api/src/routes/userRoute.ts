import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validate";
import { updateSchema } from "../schemas/updateSchema";

const router = Router();

// User melihat profil sendiri
router.get("/profile", authMiddleware, userController.getProfile);

router.get("/", authMiddleware, authorizeRoles("Admin"), userController.getAllUsers);

router.get("/:id", authMiddleware, userController.getUserById);

router.patch("/:id", authMiddleware, upload.single("avatar"), validate(updateSchema), userController.editUser);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), userController.deleteUser);

export default router;
