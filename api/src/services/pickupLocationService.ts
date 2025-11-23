import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { PickupData } from "../types/pickup";


export const pickupLocationService = {
  // GET all pickup locations
  // Mengambil semua lokasi penjemputan
  async getAllPickups() {
    return prisma.tb_pickup_locations.findMany({
      orderBy: { id: "asc" },
    });
  },

  // GET pickup by ID
  // Mengambil lokasi penjemputan berdasarkan ID
  async getPickupById(id: number) {
    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id },
    });
    if (!pickup) createError("id tidak ditemukan", 404);

    return pickup;
  },

  // CREATE new pickup location
  // Menambahkan lokasi penjemputan baru
  async createPickupLocation(data: PickupData) {
    return prisma.tb_pickup_locations.create({
      data: { name: data.name },
    });
  },

  // UPDATE pickup location by ID
  // Mengubah lokasi penjemputan berdasarkan ID
  async editPickupLocation(id: number, data: PickupData) {
    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id },
    });
    if (!pickup) createError("id tidak ditemukan", 404);

    return prisma.tb_pickup_locations.update({
      where: { id },
      data,
    });
  },

  // DELETE pickup location by ID
  // Menghapus lokasi penjemputan berdasarkan ID
  async deletePickupById(id: number) {
    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id },
    });
    if (!pickup) createError("id tidak ditemukan", 404);

    return prisma.tb_pickup_locations.delete({ where: { id } });
  },
};
