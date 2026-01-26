import { NextFunction, Request, Response } from "express";
import { categoryService } from "../services/categoryService";
import { ResponseData } from "../utilities/Response";
import { ActivityAction } from "@prisma/client";
import { logActivity } from "../utilities/activityLogger";

export const categoryController = {
  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const category = await categoryService.getAllCategories(page, limit);

      return ResponseData.ok(res, category);
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const category = await categoryService.getCategoryById(id);

      return ResponseData.ok(res, category);
    } catch (error) {
      next(error);
    }
  },

  async createCategoty(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { name } = req.body;
      const category = await categoryService.addCategory({ name });

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_CREATE_CATEGORY,
        description: `Tambah kategori ${category.name}`,
        req,
      });

      return ResponseData.created(res, category);
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const category = await categoryService.editCategory(id, req.body);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_UPDATE_CATEGORY,
        description: `Ubah kategori ${category.name}`,
        req,
      });

      return ResponseData.ok(res, category);
    } catch (error) {
      next(error);
    }
  },

  async deleteCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const category = await categoryService.getCategoryById(id);
      if (!category)
        return ResponseData.notFound(res, "destinasi tidak ditemukan");

      await categoryService.deleteCategoriesById(id);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_DELETE_CATEGORY,
        description: `Hapus kategori ${category.name}`,
        req,
      });

      return ResponseData.ok(res, "kategori berhasil dihapus");
    } catch (error) {
      next(error);
    }
  },
};
