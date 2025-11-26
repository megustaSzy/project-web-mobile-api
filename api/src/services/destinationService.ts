import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { DestinationData } from "../types/destination";

export const destinationService = {

  async getAllDestinations(category?: string) {
    return prisma.tb_destinations.findMany({
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
      orderBy: { id: "asc" }
    });
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
        location: data.location,
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
        location: data.location,
        imageUrl: data.imageUrl,
        description: data.description,
        price: data.price,
        category: { connect: { id: data.categoryId } }
      }
    });
  },

  async deleteDestinationById(id: number) {
    return prisma.tb_destinations.delete({ where: { id } });
  }
};
