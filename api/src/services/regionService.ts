import prisma from "../lib/prisma";
import { UpdateRegionDTO } from "../types/region";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const regionService = {
  async getAll(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const [count, rows] = await Promise.all([
      prisma.tb_regions.count(),
      prisma.tb_regions.findMany({
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          imagePublicId: true,
          destinations: true, // ambil semua destinasi terkait
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
  },

  async getAllAdmin(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const [count, rows] = await Promise.all([
      prisma.tb_regions.count(),
      prisma.tb_regions.findMany({
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          imagePublicId: true,
          destinations: true,
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
  },
  async getById(id: number) {
    const region = await prisma.tb_regions.findUnique({
      where: { id },
      include: {
        destinations: true, // kalau mau langsung ambil destinasi terkait
      },
    });

    if (!region) throw createError("id tidak ditemukan", 404);
    return region;
  },
  async createRegion(name: string, imageUrl: string, imagePublicId: string) {
    const exist = await prisma.tb_regions.findFirst({
      where: { name },
    });

    if (exist) throw createError("nama sudah digunakan", 400);

    return prisma.tb_regions.create({
      data: {
        name,
        imageUrl,
        imagePublicId,
      },
    });
  },
  async editRegion(id: number, data: UpdateRegionDTO) {
    const region = await prisma.tb_regions.findUnique({ where: { id } });

    if (!region) throw createError("id tidak ditemukan", 404);

    return prisma.tb_regions.update({
      where: { id },
      data,
    });
  },

  async deleteRegion(id: number) {
    const region = await prisma.tb_regions.findUnique({ where: { id } });
    if (!region) throw createError("id tidak ditemukan", 404);

    const deleted = await prisma.tb_regions.delete({
      where: { id },
    });

    return deleted;
  },
};
