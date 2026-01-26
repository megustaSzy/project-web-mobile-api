import { NextFunction, Request, Response } from "express";
import { regionService } from "../services/regionService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";
import { UpdateRegionDTO } from "../types/region";
import { logActivity } from "../utilities/activityLogger";
import { ActivityAction } from "@prisma/client";

export const regionController = {
  async getRegencies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 9;

      const region = await regionService.getAll(page, limit);

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },

  async getAllRegionAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const region = await regionService.getAllAdmin(page, limit);

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
      const user = (req as any).user;

      const { name } = req.body;

      if (!name) {
        return ResponseData.badRequest(res, "nama region wajib diisi");
      }

      if (!req.file) {
        return ResponseData.badRequest(res, "file gambar wajib diupload");
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      const region = await regionService.createRegion(
        req.body.name,
        result.secure_url,
        result.public_id,
      );

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_CREATE_REGION,
        description: `Tambah region ${region.name}`,
        req,
      });

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

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

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_CREATE_REGION,
        description: `Ubah region ${region.name}`,
        req,
      });

      const updatedRegion = await regionService.editRegion(id, updateData);

      return ResponseData.ok(res, updatedRegion);
    } catch (error) {
      next(error);
    }
  },
  async deleteRegion(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const region = await regionService.deleteRegion(id);
      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_DELETE_REGION,
        description: `Hapus region ${region.name}`,
        req,
      });

      return ResponseData.ok(res, region);
    } catch (error) {
      next(error);
    }
  },
};
