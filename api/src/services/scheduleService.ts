import prisma from "../lib/prisma";
import { createError } from "../utils/createError";

export interface ScheduleData {
  pickupLocationId: number;
  destinationId: number;
  time: string;
  date: string; // format harus YYYY-MM-DD
}

// Helper: parsing date aman
function parseSafeDate(date: string): Date {
  const parsed = new Date(date + "T00:00:00");
  if (isNaN(parsed.getTime())) {
    throw createError("Format tanggal tidak valid (gunakan YYYY-MM-DD)", 400);
  }
  return parsed;
}

export const scheduleService = {
  // GET ALL
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

  // GET BY ID
  async getScheduleById(id: number) {
    const schedule = await prisma.tb_schedules.findUnique({
      where: { id },
      include: {
        pickupLocation: true,
        destination: true,
      },
    });

    if (!schedule) throw createError("ID schedule tidak ditemukan", 404);

    return schedule;
  },

  // CREATE
  async createSchedule(data: ScheduleData) {
    return prisma.$transaction(async (tx) => {
      const parsedDate = parseSafeDate(data.date);

      // Cek duplikat
      const existingSchedule = await tx.tb_schedules.findFirst({
        where: {
          pickupLocationId: data.pickupLocationId,
          destinationId: data.destinationId,
          time: data.time,
          date: parsedDate,
        },
      });

      if (existingSchedule) {
        throw createError("Schedule sudah ada, tidak boleh duplikat", 400);
      }

      // Create schedule
      return tx.tb_schedules.create({
        data: {
          pickupLocationId: data.pickupLocationId,
          destinationId: data.destinationId,
          time: data.time,
          date: parsedDate,
        },
      });
    });
  },

  // UPDATE
  async updateSchedule(id: number, data: ScheduleData) {
    const parsedDate = parseSafeDate(data.date);

    const schedule = await prisma.tb_schedules.findUnique({
      where: { id },
    });

    if (!schedule) throw createError("ID schedule tidak ditemukan", 404);

    return prisma.tb_schedules.update({
      where: { id },
      data: {
        pickupLocationId: data.pickupLocationId,
        destinationId: data.destinationId,
        time: data.time,
        date: parsedDate,
      },
    });
  },

  // DELETE
  async deleteSchedule(id: number) {
    const existing = await prisma.tb_schedules.findUnique({ where: { id } });
    if (!existing) throw createError("ID schedule tidak ditemukan", 404);

    return prisma.tb_schedules.delete({ where: { id } });
  },

  // SEARCH
  async searchSchedule(filters: Partial<ScheduleData>) {
    const { pickupLocationId, destinationId, time, date } = filters;

    return prisma.tb_schedules.findMany({
      where: {
        pickupLocationId: pickupLocationId ? Number(pickupLocationId) : undefined,
        destinationId: destinationId ? Number(destinationId) : undefined,
        time: time || undefined,
        date: date ? parseSafeDate(date) : undefined,
      },
      include: {
        pickupLocation: true,
        destination: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  },
};
