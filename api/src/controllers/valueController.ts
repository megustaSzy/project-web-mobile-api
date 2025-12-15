import { Request, Response } from "express";
import { valueService } from "../services/valueService";
import { ResponseData } from "../utilities/Response";

export const valueController = {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const values = await valueService.getAllValue(page, limit);
      return ResponseData.ok(res, values);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getValueById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const value = await valueService.valueById(id);
      return ResponseData.ok(res, value);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async createValue(req: Request, res: Response) {
    try {
      const image = req.file ? `/uploads/${req.file.filename}` : null;
      const value = await valueService.createValue({
        ...req.body,
        imageUrl: image,
      });

      return ResponseData.created(res, value);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async editById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const updateValue = await valueService.editValue(id, {
        ...req.body,
        imageUrl: image,
      });

      return ResponseData.ok(res, updateValue);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async deleteById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const value = await valueService.deleteById(id);

      return ResponseData.ok(res, value);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
