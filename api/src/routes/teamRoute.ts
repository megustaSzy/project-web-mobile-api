import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validate";
import { createTeamSchema, updateTeamSchema } from "../schemas/teamSchema";

const router = Router();

router.get("/", teamController.getTeam);
router.get("/:id", teamController.getByIdTeam);

router.post("/", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(createTeamSchema), teamController.createTeam);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(updateTeamSchema), teamController.editTeam);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), teamController.deleteTeamById);

export default router;