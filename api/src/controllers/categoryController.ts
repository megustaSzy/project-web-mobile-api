import { Request, Response } from "express";
import { categoryService } from "../services/categoryService";
import { ResponseData } from "../utilities/Response";

export const categoryController = {
  async getCategory(req: Request, res: Response) {
    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const category = await categoryService.getAllCategories(page, limit);

      return ResponseData.ok(res, category);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getCategoryById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const category = await categoryService.getCategoryById(id);

      return ResponseData.ok(res, category);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async createCategoty(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) return ResponseData.badRequest(res, "nama wajib diisi");

      const category = await categoryService.addCategory({ name });

      return ResponseData.created(res, category);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async updateCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
  
      if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");
  
      const category = await categoryService.editCategory(id, req.body);
  
      return ResponseData.ok(res, category);
      
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  async deleteCategories(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      await categoryService.deleteCategoriesById(id);

      return ResponseData.ok(res, "kategori berhasil dihapus");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
