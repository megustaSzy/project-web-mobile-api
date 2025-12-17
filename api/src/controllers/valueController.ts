import { Request, Response } from "express";
import { valueService } from "../services/valueService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";

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
      let imageUrl: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }
      const value = await valueService.createValue({
        ...req.body,
        ...(imageUrl && { imageUrl }),
      });

      return ResponseData.created(res, value);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async editById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      let imageUrl: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }

      const updateValue = await valueService.editValue(id, {
        ...req.body,
        ...(imageUrl && { imageUrl }),
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
