import { Request, Response } from "express";
import { testimoniService } from "../services/testimoniService";
import { ResponseData } from "../utilities/Response";

export const testimoniController = {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const testimoni = await testimoniService.getAllTestimoni(page, limit);

      return ResponseData.ok(res, testimoni, "data testimoni berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.getByIdTestimoni(id);

      return ResponseData.ok(res, testimoni, "testimoni berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const testimoni = await testimoniService.createTestimoni(
        userId,
        req.body
      );

      return ResponseData.created(res, testimoni, "berhasil membuat testimoni");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async edit(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const userId = (req as any).user.id;

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.editTestimoni(
        id,
        userId,
        req.body
      );
      return ResponseData.ok(res, testimoni, "testimoni berhasil diupdate");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.deleteTestimoni(id);

      return ResponseData.ok(res, testimoni, "testimoni berhasil dihapus");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
