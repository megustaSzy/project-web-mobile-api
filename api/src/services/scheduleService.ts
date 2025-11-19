import prisma from "../lib/prisma";
import { createError } from "../utils/createError";

export interface ScheduleData {
  pickupLocationId: number;
  destinationId: number;
  time: string;
  date: string;
}

export const scheduleService = {

  // GET all schedules
  // Mengambil semua jadwal, termasuk relasi pickupLocation & destination
  async getAllSchedules() {
    return prisma.tb_schedules.findMany({
      include: {
        pickupLocation: true,
        destination: true,
      },
      orderBy: {
        date: "asc",
      },
    });
  },

  // GET schedule by ID
  // Mengambil schedule berdasarkan ID
  async getScheduleById(id: number) {
    const schedule = await prisma.tb_schedules.findUnique({
      where: { id },
      include: {
        pickupLocation: true,
        destination: true,
      },
    });

    if (!schedule) createError("Schedule tidak ditemukan", 404);

    return schedule;
  },

  // CREATE new schedule
  // Membuat schedule baru, mencegah duplikat
  async createSchedule(data: ScheduleData) {
    const existingSchedule = await prisma.tb_schedules.findFirst({
      where: {
        pickupLocationId: data.pickupLocationId,
        destinationId: data.destinationId,
        time: data.time,
        date: new Date(data.date),
      },
    });

    if (existingSchedule) createError("Schedule sudah ada, tidak boleh duplikat", 400);

    return prisma.tb_schedules.create({
      data: {
        pickupLocationId: data.pickupLocationId,
        destinationId: data.destinationId,
        time: data.time,
        date: new Date(data.date),
      },
    });
  },

  // UPDATE schedule by ID
  // Mengubah jadwal berdasarkan ID
  async updateSchedule(id: number, data: ScheduleData) {
    const schedule = await prisma.tb_schedules.findUnique({ where: { id } });
    if (!schedule) createError("Schedule tidak ditemukan", 404);

    return prisma.tb_schedules.update({
      where: { id },
      data: {
        pickupLocationId: data.pickupLocationId,
        destinationId: data.destinationId,
        time: data.time,
        date: new Date(data.date),
      },
    });
  },

  // DELETE schedule by ID
  // Menghapus jadwal berdasarkan ID
  async deleteSchedule(id: number) {
    const schedule = await prisma.tb_schedules.findUnique({ where: { id } });
    if (!schedule) createError("Schedule tidak ditemukan", 404);

    return prisma.tb_schedules.delete({ where: { id } });
  },

  // SEARCH schedule dengan filter opsional
  // Mencari schedule berdasarkan pickupLocation, destination, time, dan date
  async searchSchedule(filters: Partial<ScheduleData>) {
    const { pickupLocationId, destinationId, time, date } = filters;

    return prisma.tb_schedules.findMany({
      where: {
        pickupLocationId: pickupLocationId ? Number(pickupLocationId) : undefined,
        destinationId: destinationId ? Number(destinationId) : undefined,
        time: time || undefined,
        date: date ? new Date(date) : undefined,
      },
      include: {
        pickupLocation: true,
        destination: true,
      },
      orderBy: { id: "asc" },
    });
  },
};
