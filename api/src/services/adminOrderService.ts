import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";
import { v4 as uuidv4 } from "uuid";

export const adminOrderService = {
  // Admin membuat order (1 order = 1 tiket)
  async createOrder(userId: number, scheduleId: number, quantity: number) {
    if (quantity <= 0) throw createError("quantity minimal 1", 400);

    const user = await prisma.tb_user.findUnique({
      where: { id: userId },
    });
    if (!user) throw createError("user tidak ditemukan", 404);

    const schedule = await prisma.tb_schedules.findUnique({
      where: { id: scheduleId },
      include: { destination: true },
    });
    if (!schedule) throw createError("jadwal tidak ditemukan", 404);

    // Hitung total harga
    const totalPrice = schedule.destination.price * quantity;

    // Generate ticket
    const ticketCode = "TCK-" + uuidv4().split("-")[0].toUpperCase();

    const order = await prisma.tb_orders.create({
      data: {
        userId,
        scheduleId,
        quantity,
        totalPrice,

        // snapshot user
        userName: user.name,
        userPhone: user.notelp ?? "",

        // snapshot destination
        destinationName: schedule.destination.name,
        destinationPrice: schedule.destination.price,

        // snapshot schedule
        date: schedule.date,
        time: schedule.time,

        // tiket
        ticketCode,
        ticketUrl: null, // nanti diisi setelah generate PDF
        isPaid: false,
      },
    });

    return order;
  },

  // Get semua order
  async getAllOrders(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_orders.count();

    const rows = await prisma.tb_orders.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
            provider: true,
            providerId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        schedule: true,
      },
    });

    return pagination.paginate({ count, rows });
  },

  // Detail order
  async getOrderById(id: number) {
    const order = await prisma.tb_orders.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
            provider: true,
            providerId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        schedule: true,
      },
    });

    if (!order) throw createError("order tidak ditemukan", 404);

    return order;
  },

  // Hapus order
  async deleteById(id: number) {
    const order = await prisma.tb_orders.findUnique({ where: { id } });
    if (!order) throw createError("order tidak ditemukan", 404);

    try {
      return await prisma.tb_orders.delete({ where: { id } });
    } catch {
      throw createError("order tidak dapat dihapus karena relasi", 409);
    }
  },
};
