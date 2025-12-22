import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";
import {
  DEFAULT_INCLUDE,
  DEFAULT_KETENTUAN,
  DEFAULT_PERHATIAN,
} from "../constants/destinationDefaults";
import {
  CreateDestinationDTO,
  UpdateDestinationDTO,
} from "../schemas/destinationSchema";

export const destinationService = {
  async getAllDestinations(page: number, limit: number, category?: string) {
    const pagination = new Pagination(page, limit);

    const whereCondition = category
      ? {
          category: {
            name: {
              contains: category,
              mode: "insensitive" as const, 
            },
          },
        }
      : undefined;

    const [count, rows] = await Promise.all([
      prisma.tb_destinations.count({
        where: whereCondition,
      }),

      prisma.tb_destinations.findMany({
        where: whereCondition,
        include: {
          category: true,
          region: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { id: "asc" },
        skip: pagination.offset,
        take: pagination.limit,
      }),
    ]);

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

  async addDestination(data: CreateDestinationDTO) {
    const existing = await prisma.tb_destinations.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existing) throw createError("nama destinasi sudah ada", 400);

    const category = await prisma.tb_category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) throw createError("category tidak ditemukan", 404);

    const region = await prisma.tb_regions.findUnique({
      where: {
        id: data.regionId,
      },
    });

    if (!region) throw createError("region tidak ditemukan", 404);

    return prisma.tb_destinations.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl!,
        imagePublicId: data.imagePublicId!,
        description: data.description,
        price: data.price,

        include: DEFAULT_INCLUDE,
        ketentuan: DEFAULT_KETENTUAN,
        perhatian: DEFAULT_PERHATIAN,

        category: {
          connect: {
            id: data.categoryId,
          },
        },

        region: {
          connect: {
            id: data.regionId,
          },
        },
      },
      include: {
        category: true,
        region: true,
      },
    });
  },

  async editDestination(id: number, data: UpdateDestinationDTO) {
    const existing = await prisma.tb_destinations.findUnique({
      where: { id },
    });

    if (!existing) throw createError("destinasi tidak ditemukan", 404);

    return prisma.tb_destinations.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.imagePublicId !== undefined && {
          imagePublicId: data.imagePublicId,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.price !== undefined && { price: data.price }),

        ...(data.categoryId !== undefined && {
          category: {
            connect: { id: data.categoryId },
          },
        }),

        ...(data.regionId !== undefined && {
          region: {
            connect: { id: data.regionId },
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
