import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { DestinationData } from "../types/destination";
import { Pagination } from "../utilities/Pagination";

export const destinationService = {

  async getAllDestinations(page: number, limit: number,category?: string) {
    // limit 10
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_destinations.count({
      where: category
        ? {
            category: {
              name: {
                contains: category,
                mode: "insensitive"
              }
            }
          }
        : undefined,
    });

    const rows = await prisma.tb_destinations.findMany({
      where: category
        ? {
            category: {
              name: {
                contains: category,
                mode: "insensitive"
              }
            }
          }
        : undefined,
      include: {
        category: true
      },
      orderBy: { id: "asc" },
      skip: pagination.offset,
      take: pagination.limit
    });

    return pagination.paginate({ count, rows })
  },

  async getDestinationById(id: number) {
    const destination = await prisma.tb_destinations.findUnique({
      where: { id },
    });

    if (!destination) createError("destinasi tidak ditemukan", 404);

    return destination;
  },

  async addDestination(data: DestinationData) {
    const category = await prisma.tb_category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) createError("category tidak ditemukan", 404);

    return prisma.tb_destinations.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        description: data.description,
        price: data.price,
        category: { connect: { id: data.categoryId } }
      },
      include: {
        category: true
      }
    });
  },


  async editDestination(id: number, data: DestinationData) {
    return prisma.tb_destinations.update({
      where: { id },
      data: {
        name: data.name,
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
        description: data.description,
        price: data.price,
        category: { connect: { id: data.categoryId } }
      }
    });
  },

  async deleteDestinationById(id: number) {
    const existing = await prisma.tb_destinations.findFirst({
      where: {
        id
      }
    });

    if(!existing) createError("id tidak ditemukan", 404);

    return prisma.tb_destinations.delete({ where: { id } });
  }
};
