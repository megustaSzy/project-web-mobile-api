import { Request, Response } from "express";
import { destinationService } from "../services/destinationService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import { UpdateDestinationDTO } from "../schemas/destinationSchema";

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

      const destination = await destinationService.addDestination({
        ...req.body,
        imageUrl: result.secure_url, // URL Cloudinary
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

      let imageUrl: string | undefined;

      // Upload ke Cloudinary jika ada file baru
      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }

      // Gabungkan body + imageUrl kalau ada
      const updateData: UpdateDestinationDTO = {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      };

      const updatedDestination = await destinationService.editDestination(
        id,
        updateData
      );

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
