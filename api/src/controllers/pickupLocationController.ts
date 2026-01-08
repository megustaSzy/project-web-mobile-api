import { pickupLocationService } from "../services/pickupLocationService";
import { Request, Response, NextFunction } from "express";
import { ResponseData } from "../utilities/Response";

export const pickupLocationController = {
  async getAllPickup(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const pickups = await pickupLocationService.getAllPickups();
      return ResponseData.ok(res, pickups);
    } catch (error) {
      next(error);
    }
  },

  async getPickupById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const pickup = await pickupLocationService.getPickupById(id);
      return ResponseData.ok(res, pickup);
    } catch (error) {
      next(error);
    }
  },

  async addPickup(req: Request, res: Response, next: NextFunction) {
    try {
      const pickup = await pickupLocationService.createPickupLocation(req.body);
      return ResponseData.created(res, pickup);
    } catch (error) {
      next(error);
    }
  },

  async updatePickupLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const updatedPickup = await pickupLocationService.editPickupLocation(
        id,
        req.body
      );
      return ResponseData.ok(res, updatedPickup);
    } catch (error) {
      next(error);
    }
  },

  async deletePickup(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  },
};
