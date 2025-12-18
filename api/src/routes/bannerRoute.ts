import { Router } from "express";
import { bannerController } from "../controllers/bannerController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validate";
import { createBannerSchema, updateBannerSchema } from "../schemas/bannerSchema";


const router = Router();

router.get("/", bannerController.getBanner);
router.get("/:id", bannerController.getByIdBanner);
router.post("/", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(createBannerSchema), bannerController.create);
router.patch("/:id", authMiddleware, authorizeRoles("Admin"), upload.single("image"), validate(updateBannerSchema), bannerController.edit);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"),bannerController.deleteBanner);


export default router;