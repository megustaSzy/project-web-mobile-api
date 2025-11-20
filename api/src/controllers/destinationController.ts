import { NextFunction, Request, Response } from "express";
import { destinationService } from "../services/destinationService";
import { createError } from "../utils/createError";

export const destinationController = {

  // GET all destinations
  // Mengambil semua destinasi
  async getDestinations(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await destinationService.getAllDestinations();
      return res.status(200).json({
        success: true,
        data: destinations,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET destination by ID
  // Mengambil destinasi berdasarkan ID
  async getDestinationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const destination = await destinationService.getDestinationById(id);
      if (!destination) throw createError("Destinasi tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST add new destination
  // Menambahkan destinasi baru
  async addDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const destination = await destinationService.addDestination(req.body);

      return res.status(201).json({
        success: true,
        message: "Berhasil menambahkan destinasi",
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT update destination by ID
  // Mengubah data destinasi berdasarkan ID
  async updateDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const updatedDestination = await destinationService.editDestination(id, req.body);
      if (!updatedDestination) throw createError("Destinasi tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        message: "Destinasi berhasil diperbarui",
        data: updatedDestination,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE destination by ID
  // Menghapus destinasi berdasarkan ID
  async deleteDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const deletedDestination = await destinationService.deleteDestinationById(id);
      if (!deletedDestination) throw createError("Destinasi tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        message: "Destinasi berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};
