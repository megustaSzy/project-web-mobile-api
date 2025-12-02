import { pickupLocationService } from "../services/pickupLocationService";
import { Request, Response } from "express";
import { ResponseData } from "../utilities/Response";

export const pickupLocationController = {
  async getAllPickup(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const pickups = await pickupLocationService.getAllPickups(page, limit);
      return ResponseData.ok(
        res,
        pickups,
        "daftar lokasi penjemputan berhasil diambil"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getPickupById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const pickup = await pickupLocationService.getPickupById(id);
      return ResponseData.ok(
        res,
        pickup,
        "lokasi penjemputan berhasil diambil"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async addPickup(req: Request, res: Response) {
    try {
      const pickup = await pickupLocationService.createPickupLocation(req.body);
      return ResponseData.created(
        res,
        pickup,
        "lokasi penjemputan berhasil ditambahkan"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async updatePickupLocation(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const updatedPickup = await pickupLocationService.editPickupLocation(
        id,
        req.body
      );
      return ResponseData.ok(
        res,
        updatedPickup,
        "lokasi penjemputan berhasil diperbarui"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async deletePickup(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const deleted = await pickupLocationService.deletePickupById(id);
      return ResponseData.ok(
        res,
        deleted,
        "lokasi penjemputan berhasil dihapus"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
