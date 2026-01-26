import { pickupLocationService } from "../services/pickupLocationService";
import { Request, Response, NextFunction } from "express";
import { ResponseData } from "../utilities/Response";
import { logActivity } from "../utilities/activityLogger";
import { ActivityAction } from "@prisma/client";

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
      const user = (req as any).user;
      const pickup = await pickupLocationService.createPickupLocation(req.body);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_CREATE_PICKUP,
        description: `Tambah pickup ${pickup.name}`,
        req,
      });

      return ResponseData.created(res, pickup);
    } catch (error) {
      next(error);
    }
  },

  async updatePickupLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const updatedPickup = await pickupLocationService.editPickupLocation(
        id,
        req.body,
      );

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_UPDATE_PICKUP,
        description: `Ubah pickup ${updatedPickup.name}`,
        req,
      });

      return ResponseData.ok(res, updatedPickup);
    } catch (error) {
      next(error);
    }
  },

  async deletePickup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const deleted = await pickupLocationService.deletePickupById(id);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_DELETE_PICKUP,
        description: `Hapus pickup ${deleted.name}`,
        req,
      });
      return ResponseData.ok(
        res,
        deleted,
        "lokasi penjemputan berhasil dihapus",
      );
    } catch (error) {
      next(error);
    }
  },
};
