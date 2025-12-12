import { Router } from "express";
import { bannerController } from "../controllers/bannerController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";


const router = Router();

router.get("/", bannerController.getBanner);
router.get("/:id", bannerController.getByIdBanner);
router.post("/", authMiddleware, authorizeRoles("Admin"), bannerController.create);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), bannerController.edit);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"),bannerController.deleteBanner);


export default router;