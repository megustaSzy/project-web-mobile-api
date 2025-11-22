import { pickupLocationService } from "../services/pickupLocationService";
import { NextFunction, Request, Response } from "express";
import { createError } from "../utilities/createError";

export const pickupLocationController = {
  // GET all pickup locations
  // Mengambil semua lokasi penjemputan
  async getAllPickup(req: Request, res: Response, next: NextFunction) {
    try {
      const pickups = await pickupLocationService.getAllPickups();

      return res.status(200).json({
        success: true,
        data: pickups,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET pickup location by ID
  // Mengambil lokasi penjemputan berdasarkan ID
  async getPickupById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const pickup = await pickupLocationService.getPickupById(id);
      if (!pickup) throw createError("Lokasi tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        data: pickup,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST add new pickup location
  // Menambahkan lokasi penjemputan baru
  async addPickup(req: Request, res: Response, next: NextFunction) {
    try {
      const pickup = await pickupLocationService.createPickupLocation(req.body);

      return res.status(201).json({
        success: true,
        message: "Berhasil menambah lokasi penjemputan",
        data: pickup,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT update pickup location by ID
  // Mengubah lokasi penjemputan berdasarkan ID
  async updatePickupLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const updatedPickup = await pickupLocationService.editPickupLocation(
        id,
        req.body
      );
      if (!updatedPickup) throw createError("Lokasi tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        message: "Lokasi berhasil diperbarui",
        data: updatedPickup,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE pickup location by ID
  // Menghapus lokasi penjemputan berdasarkan ID
  async deletePickup(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const deleted = await pickupLocationService.deletePickupById(id);
      if (!deleted) throw createError("Lokasi tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        message: "Lokasi berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};
