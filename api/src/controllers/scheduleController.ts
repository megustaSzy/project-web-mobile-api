import { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/scheduleService";
import { createError } from "../utils/createError";

export const scheduleController = {

  // GET all schedules
  // Mengambil semua schedule dari database
  async getAllSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const schedules = await scheduleService.getAllSchedules();
      return res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET schedule by ID
  // Mengambil schedule berdasarkan ID
  async getScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const schedule = await scheduleService.getScheduleById(id);
      if (!schedule) throw createError("Schedule tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST create new schedule
  // Membuat schedule baru dengan data dari request body
  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { pickupLocationId, destinationId, time, date } = req.body;

      if (!pickupLocationId || !destinationId || !time || !date) {
        return res.status(400).json({
          success: false,
          message: "pickupLocationId, destinationId, time, dan date wajib diisi",
        });
      }

      const data = {
        pickupLocationId: Number(pickupLocationId),
        destinationId: Number(destinationId),
        time: String(time),
        date: String(date),
      };

      const schedule = await scheduleService.createSchedule(data);

      return res.status(201).json({
        success: true,
        message: "Schedule berhasil dibuat",
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT update schedule by ID
  // Mengubah data schedule berdasarkan ID
  async editScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const schedule = await scheduleService.updateSchedule(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Schedule berhasil diubah",
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE schedule by ID
  // Menghapus schedule berdasarkan ID
  async deleteScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw createError("ID tidak valid", 400);

      await scheduleService.deleteSchedule(id);

      return res.status(200).json({
        success: true,
        message: "Schedule berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },

  // GET search schedules
  // Mencari schedule berdasarkan filter query
  async searchSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = req.query;

      const schedules = await scheduleService.searchSchedule(filters);

      return res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (error) {
      next(error);
    }
  },

};
