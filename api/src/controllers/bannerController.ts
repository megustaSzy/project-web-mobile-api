import { NextFunction, Request, Response } from "express";
import { bannerService } from "../services/bannerService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";

export const bannerController = {
  async getBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const banner = await bannerService.getAllBanner();

      return ResponseData.ok(res, banner, "berhasil mengambil data");
    } catch (error) {
      next(error);
    }
  },

  async getByIdBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const banner = await bannerService.getByIdBanner(id);

      return ResponseData.ok(res, banner);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return ResponseData.badRequest(res, "image wajib diupload");
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      const banner = await bannerService.createBanner({
        ...req.body,
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      });
      return ResponseData.created(res, banner);
    } catch (error) {
      next(error);
    }
  },

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const banner = await bannerService.getByIdBanner(id);
      if (!banner) return ResponseData.notFound(res, "banner tidak ditemukan");

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;

        if (banner.imagePublicId) {
          await cloudinary.uploader.destroy(banner.imagePublicId);
        }
      }

      const updateBanner = await bannerService.editBanner(id, {
        ...req.body,
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId }),
      });

      return ResponseData.ok(res, updateBanner);
    } catch (error) {
      next(error);
    }
  },

  async deleteBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const banner = await bannerService.deleteBanner(id);

      return ResponseData.ok(res, banner);
    } catch (error) {
      next(error);
    }
  },
};
