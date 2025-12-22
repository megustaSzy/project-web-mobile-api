import { Request, Response } from "express";
import { destinationService } from "../services/destinationService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import { UpdateDestinationDTO } from "../schemas/destinationSchema";
import cloudinary from "../config/cloudinary";

export const destinationController = {
  async getDestinations(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = 10;
      const category = req.query.category as string | undefined;

      const destinations = await destinationService.getAllDestinations(
        page,
        limit,
        category
      );

      return ResponseData.ok(
        res,
        destinations,
        category
          ? `destinasi kategori ${category} berhasil diambil`
          : "semua destinasi berhasil diambil"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getDestinationById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const destination = await destinationService.getDestinationById(id);

      return ResponseData.ok(res, destination);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async addDestination(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ResponseData.badRequest(res, "image wajib diupload");
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      if (!result?.public_id || !result?.secure_url) {
        return ResponseData.serverError(res, "Upload gambar gagal");
      }

      const destination = await destinationService.addDestination({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        categoryId: Number(req.body.categoryId),
        regionId: Number(req.body.regionId),

        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      });

      return ResponseData.created(res, destination);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
  async updateDestination(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const destination = await destinationService.getDestinationById(id);
      if (!destination) {
        return ResponseData.badRequest(res, "destination tidak ditemukan");
      }

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);

        if (!result?.public_id || !result?.secure_url) {
          return ResponseData.serverError(res, "Upload gambar gagal");
        }

        if (destination.imagePublicId !== null) {
          try {
            await cloudinary.uploader.destroy(destination.imagePublicId);
          } catch (err) {
            console.error("Gagal hapus gambar lama:", err);
          }
        }

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      }

      const updatedDestination = await destinationService.editDestination(id, {
        ...(req.body.name !== undefined && { name: req.body.name }),
        ...(req.body.description !== undefined && {
          description: req.body.description,
        }),
        ...(req.body.price !== undefined && {
          price: Number(req.body.price),
        }),
        ...(req.body.categoryId !== undefined && {
          categoryId: Number(req.body.categoryId),
        }),
        ...(req.body.regionId !== undefined && {
          regionId: Number(req.body.regionId),
        }),

        ...(imageUrl !== undefined && { imageUrl }),
        ...(imagePublicId !== undefined && { imagePublicId }),
      });

      return ResponseData.ok(res, updatedDestination);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
  async deleteDestination(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      await destinationService.deleteDestinationById(id);

      return ResponseData.ok(res, null, "destinasi berhasil dihapus");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
