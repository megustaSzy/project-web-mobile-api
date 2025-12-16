import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { DestinationData } from "../types/destination";
import { Pagination } from "../utilities/Pagination";
import {
  DEFAULT_INCLUDE,
  DEFAULT_KETENTUAN,
  DEFAULT_PERHATIAN,
} from "../constants/destinationDefaults";

export const destinationService = {
  async getAllDestinations(page: number, limit: number, category?: string) {
    // limit 10
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_destinations.count({
      where: category
        ? {
            category: {
              name: {
                contains: category,
                mode: "insensitive",
              },
            },
          }
        : undefined,
    });

    const rows = await prisma.tb_destinations.findMany({
      where: category
        ? {
            category: {
              name: {
                contains: category,
                mode: "insensitive",
              },
            },
          }
        : undefined,
      include: {
        category: true,
        region: true,
      },
      orderBy: { id: "asc" },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const mappedRows = rows.map((d) => ({
      ...d,
      include: d.include.length ? d.include : DEFAULT_INCLUDE,
      ketentuan: d.ketentuan.length ? d.ketentuan : DEFAULT_KETENTUAN,
      perhatian: d.perhatian.length ? d.perhatian : DEFAULT_PERHATIAN,
    }));

    return pagination.paginate({
      count,
      rows: mappedRows,
    });
  },

  async getDestinationById(id: number) {
    const destination = await prisma.tb_destinations.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!destination) throw createError("destinasi tidak ditemukan", 404);

    return {
      ...destination,
      include: destination.include.length
        ? destination.include
        : DEFAULT_INCLUDE,
      ketentuan: destination.ketentuan.length
        ? destination.ketentuan
        : DEFAULT_KETENTUAN,
      perhatian: destination.perhatian.length
        ? destination.perhatian
        : DEFAULT_PERHATIAN,
    };
  },

  async addDestination(data: DestinationData) {
    const price = Number(data.price);
    const categoryId = Number(data.categoryId);
    const regionId = Number(data.regionId);

    const existing = await prisma.tb_destinations.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existing) throw createError("nama destinasi sudah ada", 400);

    const category = await prisma.tb_category.findUnique({
      where: { id: categoryId },
    });

    if (!category) throw createError("category tidak ditemukan", 404);

    const region = await prisma.tb_regions.findUnique({
      where: {
        id: regionId,
      },
    });

    if (!region) createError("region tidak ditemukan", 404);

    return prisma.tb_destinations.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        description: data.description,
        price: price,

        include: DEFAULT_INCLUDE,
        ketentuan: DEFAULT_KETENTUAN,
        perhatian: DEFAULT_PERHATIAN,

        category: {
          connect: {
            id: categoryId,
          },
        },

        region: {
          connect: {
            id: regionId,
          },
        },
      },
      include: {
        category: true,
        region: true,
      },
    });
  },

  async editDestination(id: number, data: DestinationData) {
    const existing = await prisma.tb_destinations.findUnique({
      where: { id },
    });

    if (!existing) throw createError("destinasi tidak ditemukan", 404);

    return prisma.tb_destinations.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: Number(data.price) }),

        ...(data.categoryId && {
          category: {
            connect: { id: Number(data.categoryId) },
          },
        }),

        ...(data.regionId && {
          region: {
            connect: { id: Number(data.regionId) },
          },
        }),
      },
    });
  },
  async deleteDestinationById(id: number) {
    const existing = await prisma.tb_destinations.findFirst({
      where: {
        id,
      },
    });

    if (!existing) createError("id tidak ditemukan", 404);

    return prisma.tb_destinations.delete({ where: { id } });
  },
};
