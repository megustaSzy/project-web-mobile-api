import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", teamController.getTeam);
router.get("/:id", teamController.getByIdTeam);

router.post("/", authMiddleware, authorizeRoles("Admin"), teamController.createTeam);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), teamController.editTeam);

router.delete("/:id", authMiddleware, authorizeRoles("Admin"), teamController.deleteTeamById);

export default router;