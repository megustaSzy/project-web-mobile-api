import { Router } from "express";
import { aboutController } from "../controllers/aboutController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";


const router = Router();


router.get("/", aboutController.getAbout);

router.post("/", authMiddleware, authorizeRoles("Admin"),aboutController.createAbout);
router.put("/:id", authMiddleware, authorizeRoles("Admin"),aboutController.updateAbout);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), aboutController.deleteAbout);



export default router;