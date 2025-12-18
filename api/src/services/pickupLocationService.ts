import prisma from "../lib/prisma";
import { CreatePickupDTO, UpdatePickupDTO } from "../schemas/pickupSchema";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const pickupLocationService = {
  async getAllPickups(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_pickup_locations.count();
    const rows = await prisma.tb_pickup_locations.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { id: "asc" },
    });

    return pagination.paginate({ count, rows });
  },

  async getPickupById(id: number) {
    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id },
    });
    if (!pickup) createError("id tidak ditemukan", 404);
    return pickup;
  },

  async createPickupLocation(data: CreatePickupDTO) {
    if (!data.name || data.name.trim().length === 0)
      createError("nama lokasi wajib diisi", 400);

    const existing = await prisma.tb_pickup_locations.findFirst({
      where: { name: data.name },
    });
    if (existing) createError("nama lokasi sudah ada", 400);

    return prisma.tb_pickup_locations.create({ data: { name: data.name } });
  },

  async editPickupLocation(id: number, data: UpdatePickupDTO) {
    if (!data.name || data.name.trim().length === 0)
      createError("nama lokasi wajib diisi", 400);

    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id },
    });
    if (!pickup) createError("id tidak ditemukan", 404);

    const existing = await prisma.tb_pickup_locations.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) createError("nama lokasi sudah digunakan", 400);

    return prisma.tb_pickup_locations.update({
      where: { id },
      data,
    });
  },

  async deletePickupById(id: number) {
    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id },
    });
    if (!pickup) createError("id tidak ditemukan", 404);

    return prisma.tb_pickup_locations.delete({ where: { id } });
  },
};
