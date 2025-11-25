import { Router } from "express";
import { categoryController } from "../controllers/categoryController";


const router = Router();

router.get("/", categoryController.getCategory);


export default router