import { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/scheduleService";
import { createError } from "../utilities/createError";
import { ResponseData } from "../utilities/Response";

export const scheduleController = {
  // GET all schedules
  // Mengambil semua schedule dari database
  async getAllSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const schedules = await scheduleService.getAllSchedules();
      return ResponseData.ok(
        res,
        schedules,
        "daftar schedule berhasil diambil"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // GET schedule by ID
  // Mengambil schedule berdasarkan ID
  async getScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      const schedule = await scheduleService.getScheduleById(id);

      return ResponseData.ok(res, schedule, "schedule berhasil diambil");

    } catch (error) {

      ResponseData.serverError(res, error);
    }
  },

  // POST create new schedule
  // Membuat schedule baru dengan data dari request body
  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { pickupLocationId, destinationId, time, date } = req.body;

      if (!pickupLocationId || !destinationId || !time || !date) {
        return ResponseData.badRequest(res, "semua field wajib diisi");
      }

      // Validasi waktu format HH:MM
      if (!/^\d{2}:\d{2}$/.test(time)) {
        return ResponseData.badRequest(res, "Format time tidak valid (gunakan HH:MM)");
      }

      // Validasi tanggal
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return ResponseData.badRequest(res, "Format date tidak valid (gunakan YYYY-MM-DD)");
      }

      const data = {
        pickupLocationId: Number(pickupLocationId),
        destinationId: Number(destinationId),
        time: String(time),
        date: String(date),
      };

      const schedule = await scheduleService.createSchedule(data);

      return ResponseData.created(res, schedule, "schedule berhasil dibuat");

    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
  // PUT update schedule by ID
  // Mengubah data schedule berdasarkan ID
  async editScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const schedule = await scheduleService.updateSchedule(id, req.body);

      return ResponseData.ok(res, schedule, "schedule berhasil diperbarui");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // DELETE schedule by ID
  // Menghapus schedule berdasarkan ID
  async deleteScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) ResponseData.badRequest(res, "id tidak valid");

      await scheduleService.deleteSchedule(id);

      return ResponseData.ok(res, null, "schedule berhasil dihapus");
    } catch (error) {
      ResponseData.serverError(res, error);
    }
  },

  // GET search schedules
  // Mencari schedule berdasarkan filter query
  async searchSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = req.query;

      const schedules = await scheduleService.searchSchedule(filters);

      return ResponseData.ok(res, schedules, "hasil pencarian schedule berhasil diambil");

    } catch (error) {
      ResponseData.serverError(res, error);
    }
  },
};
