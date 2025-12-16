import prisma from "../lib/prisma";
import { RegionData } from "../types/region";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination"


export const regionService = {
  async getAll(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_regions.count();

    const rows = await prisma.tb_regions.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        id: 'asc'
      },
      include: {
        destinations: true
      }
    });

    return pagination.paginate({ count, rows })
  },

  async getById(id: number) {
    const region = await prisma.tb_regions.findUnique({
      where: {
        id
      },
      include: {
        destinations: true
      }
    });

    if(!region) throw createError("id tidak ditemukan", 404);

    return region;
  },

  async createRegion(data: RegionData) {
    const region = await prisma.tb_regions.findFirst({
      where: {
        name: data.name
      },
    });

    if(region) throw createError("nama sudah digunakan", 400);

    return prisma.tb_regions.create({
      data: {
        name: data.name
      }
    })
  },

  async editRegion(id: number, data: RegionData) {
    const region = await prisma.tb_regions.findUnique({
      where: {
        id
      }
    });

    if(!region) throw createError("id tidak ditemukan", 404);

    return prisma.tb_regions.update({
      where: {
        id
      },
      data
    })
  },

  async deleteRegion(id: number) {
    const region = await prisma.tb_regions.findUnique({
      where: {
        id
      }
    });

    if(!region) throw createError("id tidak ditemukan", 404);

    return prisma.tb_regions.delete({
      where: {
        id
      }
    })
  }
}