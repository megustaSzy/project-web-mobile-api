import prisma from "../lib/prisma";
import { CreateRegionDTO } from "../schemas/regionSchema";
import { createError } from "../utilities/createError";

// cache global (1 instance per server)
const regionCache = new Map<string, any>();

export const regionService = {
  async getAll(page: number, limit: number) {
    const key = `${page}-${limit}`;
    const cached = regionCache.get(key);

    if (cached) {
      return cached;
    }

    const rows = await prisma.tb_regions.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    const result = {
      page,
      limit,
      hasNext: rows.length === limit,
      rows: rows.map((r) => ({
        id: r.id,
        name: r.name,
      })),
    };

    regionCache.set(key, result);
    return result;
  },

  async getById(id: number) {
    const region = await prisma.tb_regions.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        destinations: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!region) throw createError("id tidak ditemukan", 404);
    return region;
  },

  async createRegion(data: CreateRegionDTO) {
    const region = await prisma.tb_regions.findFirst({
      where: { name: data.name },
    });

    if (region) throw createError("nama sudah digunakan", 400);

    const created = await prisma.tb_regions.create({
      data: { name: data.name },
    });

    regionCache.clear();
    return created;
  },

  async editRegion(id: number, data: CreateRegionDTO) {
    const region = await prisma.tb_regions.findUnique({ where: { id } });
    if (!region) throw createError("id tidak ditemukan", 404);

    const updated = await prisma.tb_regions.update({
      where: { id },
      data,
    });

    regionCache.clear(); 
    return updated;
  },

  async deleteRegion(id: number) {
    const region = await prisma.tb_regions.findUnique({ where: { id } });
    if (!region) throw createError("id tidak ditemukan", 404);

    const deleted = await prisma.tb_regions.delete({
      where: { id },
    });

    regionCache.clear(); 
    return deleted;
  },
};
