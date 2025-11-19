import prisma from "../lib/prisma";
import { createError } from "../utils/createError";

interface DestinationData {
  name: string;
  location: string;
  imageUrl: string;
  description: string;
  price: number;
  category: string;
}

export const destinationService = {

  // GET all destinations
  // Mengambil semua destinasi
  async getAllDestinations() {
    return prisma.tb_destinations.findMany({
      orderBy: { id: "asc" },
    });
  },

  // GET destination by ID
  // Mengambil destinasi berdasarkan ID
  async getDestinationById(id: number) {
    const destination = await prisma.tb_destinations.findUnique({ where: { id } });
    if (!destination) createError("Destinasi tidak ditemukan", 404);

    return destination;
  },

  // CREATE new destination
  // Menambahkan destinasi baru, mencegah duplikat nama
  async addDestination(data: DestinationData) {
    const existingDestination = await prisma.tb_destinations.findFirst({ where: { name: data.name } });
    if (existingDestination) createError("Nama pantai sudah ada", 400);

    return prisma.tb_destinations.create({
      data: {
        name: data.name,
        location: data.location,
        imageUrl: data.imageUrl,
        description: data.description,
        price: data.price,
        category: data.category,
      },
    });
  },

  // UPDATE destination by ID
  // Mengubah destinasi berdasarkan ID
  async editDestination(id: number, data: DestinationData) {
    const destination = await prisma.tb_destinations.findUnique({ where: { id } });
    if (!destination) createError("ID tidak ditemukan", 404);

    return prisma.tb_destinations.update({
      where: { id },
      data,
    });
  },

  // DELETE destination by ID
  // Menghapus destinasi berdasarkan ID
  async deleteDestinationById(id: number) {
    const destination = await prisma.tb_destinations.findUnique({ where: { id } });
    if (!destination) createError("ID tidak ditemukan", 404);

    return prisma.tb_destinations.delete({ where: { id } });
  },
};
