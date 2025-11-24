import { NextFunction, Request, response, Response } from "express";
import { destinationService } from "../services/destinationService";
import { createError } from "../utilities/createError";
import { ResponseData } from "../utilities/Response";

export const destinationController = {
  // GET all destinations
  // Mengambil semua destinasi
  async getDestinations(req: Request, res: Response) {
    try {
      const destinations = await destinationService.getAllDestinations();

      return ResponseData.ok(res, destinations, "daftar destinasi berhasil diambil");

    } catch (error) {
      ResponseData.serverError(res, error);
    }
  },

  async getByCategory(req: Request, res: Response) {
    try {
      const { category }= req.params;

      const destinations = await destinationService.getByCategory(category);

      return ResponseData.ok(res, destinations, "berhasil menampilkan kategori");
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  // GET destination by Id
  async getDestinationById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      const destination = await destinationService.getDestinationById(id);

      return ResponseData.ok(res, destination, "destinasi berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // Menambahkan destinasi baru
  async addDestination(req: Request, res: Response) {
    try {
      const destination = await destinationService.addDestination(req.body);

      return ResponseData.created(res, destination, "destinasi berhasil ditambahkan");
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  // Mengubah data destinasi berdasarkan ID
  async updateDestination(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      const updatedDestination = await destinationService.editDestination(
        id,
        req.body
      );

      return ResponseData.ok(res, updatedDestination, "destinasi berhasil diperbarui");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // Menghapus destinasi berdasarkan ID
  async deleteDestination(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      await destinationService.deleteDestinationById(id);

      return ResponseData.ok(res, null, "destinasi berhasil dihapus");

    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },


};
