import { Request, Response } from "express";
import { categoryService } from "../services/categoryService";
import { ResponseData } from "../utilities/Response";



export const categoryController = {

    async getCategory(req: Request, res: Response) {
        try {
            const category = await categoryService.getByCategory();
            return ResponseData.ok(res, category, "category berhasil diambil")
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },
    

}