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

    async createCategoty(req: Request, res: Response) {
        try {

            const { name } = req.body;

            if(!name) return ResponseData.badRequest(res, "nama wajib diisi");

            const category = await categoryService.addCategory({name});

            return ResponseData.created(res, category, "berhasil menambah category")
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }
    

}