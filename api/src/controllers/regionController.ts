import { NextFunction, Request, Response } from "express";
import { regionService } from "../services/regionService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";
import { UpdateRegionDTO } from "../types/region";

export const regionController = {
  async getRegencies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const region = await regionService.getAll(page, limit);

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const region = await regionService.getById(id);

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        return ResponseData.badRequest(res, "nama region wajib diisi");
      }

      const region = await regionService.createRegion(req.body);

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "ID tidak valid");

      const region = await regionService.getById(id);
      if (!region) return ResponseData.notFound(res, "Region tidak ditemukan");

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;

        if (region.imagePublicId) {
          await cloudinary.uploader.destroy(region.imagePublicId);
        }
      }

      const updateData: UpdateRegionDTO = {
        ...req.body,
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId }),
      };

      const updatedRegion = await regionService.editRegion(id, updateData);

      return ResponseData.ok(res, updatedRegion);
    } catch (error) {
      next(error);
    }
  },
  async deleteRegion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const region = await regionService.deleteRegion(id);

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },
};
