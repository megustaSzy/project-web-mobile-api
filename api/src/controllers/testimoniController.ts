import { Request, Response } from "express";
import { testimoniService } from "../services/testimoniService";
import { ResponseData } from "../utilities/Response";
import { testimoniSchema } from "../schemas/testimoniSchema";

export const testimoniController = {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const testimoni = await testimoniService.getAllTestimoni(page, limit);

      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getApproved(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const testimoni = await testimoniService.getApprovedTestimoni(
        page,
        limit
      );

      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getPending(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const testimoni = await testimoniService.getPendingTestimoni(page, limit);
      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.getByIdTestimoni(id);

      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async create(req: Request, res: Response) {
    const result = await testimoniSchema.safeParse(req.body);

    if (!result.success) {
      return ResponseData.badRequest(res, result.error.issues[0].message);
    }

    try {
      const testimoni = await testimoniService.createTestimoni(result.data);

      return ResponseData.created(res, testimoni);
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
      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.deleteTestimoni(id);

      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async approve(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.approveTestimoni(id);

      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async reject(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const testimoni = await testimoniService.rejectedTestimoni(id);

      return ResponseData.ok(res, testimoni);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
