import { pickupLocationService } from "../services/pickupLocationService";
import { NextFunction, Request, Response } from "express";
import { createError } from "../utilities/createError";
import { ResponseData } from "../utilities/Response";

export const pickupLocationController = {
  // GET all pickup locations
  async getAllPickup(req: Request, res: Response) {
    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const pickups = await pickupLocationService.getAllPickups(page, limit);

      return ResponseData.ok(res, pickups, "daftar lokasi penjemputan berhasil diambil");

    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // GET pickup location by ID
  async getPickupById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      const pickup = await pickupLocationService.getPickupById(id);

      return ResponseData.ok(res, pickup, "lokasi penjemputan berhasil diambil");
    } catch (error) {
      ResponseData.serverError(res, error);
    }
  },

  // POST add new pickup location
  async addPickup(req: Request, res: Response) {
    try {
      const pickup = await pickupLocationService.createPickupLocation(req.body);

      return ResponseData.created(res, pickup, "lokasi penjemputan berhasil ditambahkan");
    } catch (error) {
      ResponseData.serverError(res, error);
    }
  },

  // PUT update pickup location by ID
  async updatePickupLocation(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      const updatedPickup = await pickupLocationService.editPickupLocation(
        id,
        req.body
      );

      return ResponseData.ok(res, updatedPickup, "lokasi penjemputan berhasil diperbarui");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // DELETE pickup location by ID
  async deletePickup(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      const deleted = await pickupLocationService.deletePickupById(id);

      return ResponseData.ok(res, deleted, "lokasi penjemputan berhasil dihapus");
    } catch (error) {
      ResponseData.serverError(res, error);
    }
  },
};
