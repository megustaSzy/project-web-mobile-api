import { Request, Response, NextFunction } from "express";
import { valueService } from "../services/valueService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";

export const valueController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const values = await valueService.getAllValue(page, limit);
      return ResponseData.ok(res, values);
    } catch (error) {
      next(error)
    }
  },

  async getValueById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const value = await valueService.valueById(id);
      return ResponseData.ok(res, value);
    } catch (error) {
      next(error)
    }
  },

  async createValue(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return ResponseData.badRequest(res, "image wajib diupload");
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      const value = await valueService.createValue({
        ...req.body,
        imageUrl: result.secure_url,
        imagePublicId: result.public_id
      });

      return ResponseData.created(res, value);
    } catch (error) {
      next(error)
    }
  },

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const value = await valueService.valueById(id);
      if (!value) return ResponseData.notFound(res, "value tidak ditemukan");

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;

        if (value.imagePublicId) {
          await cloudinary.uploader.destroy(value.imagePublicId);
        }
      }

      const updateValue = await valueService.editValue(id, {
        ...req.body,
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId }),
      });

      return ResponseData.ok(res, updateValue);
    } catch (error) {
      next(error)
    }
  },

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const value = await valueService.deleteById(id);

      return ResponseData.ok(res, value);
    } catch (error) {
      next(error)
    }
  },
};
