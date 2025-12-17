import prisma from "../lib/prisma";
import { CreateAdminOrderInput } from "../schemas/createAdminOrderSchema";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";
import { v4 as uuidv4 } from "uuid";

type PaymentStatusType = "pending" | "paid" | "failed" | "expired";

export const adminOrderService = {
  async createOrder(input: CreateAdminOrderInput) {
    const {
      userId,
      destinationId,
      pickupLocationId,
      quantity,
      date,
      time,
      returnTime,
      isPaid = false,
    } = input;

    const user = await prisma.tb_user.findUnique({
      where: { id: userId },
    });
    if (!user) throw createError("user tidak ditemukan", 404);

    const destination = await prisma.tb_destinations.findUnique({
      where: { id: destinationId },
    });
    if (!destination) throw createError("destinasi tidak ditemukan", 404);

    let pickupLocationName: string | null = null;

    if (pickupLocationId) {
      const pickup = await prisma.tb_pickup_locations.findUnique({
        where: { id: pickupLocationId },
      });
      if (!pickup) throw createError("pickup location tidak ditemukan", 404);

      pickupLocationName = pickup.name;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDate = new Date(date);
    orderDate.setHours(0, 0, 0, 0);

    if (orderDate < today)
      throw createError("tanggal keberangkatan sudah lewat", 400);

    const totalPrice = destination.price * quantity;

    const ticketCode = `TICKET-${Date.now()}-${uuidv4()
      .slice(0, 6)
      .toUpperCase()}`;

    const order = await prisma.tb_orders.create({
      data: {
        userId,
        quantity,
        totalPrice,

        pickupLocationId: pickupLocationId ?? null,
        pickupLocationName,

        userName: user.name,
        userPhone: user.notelp ?? "",

        destinationName: destination.name,
        destinationPrice: destination.price,

        date: orderDate,
        time,
        returnTime,

        ticketCode,
        isPaid,
        paymentStatus: isPaid
          ? ("paid" as PaymentStatusType)
          : ("pending" as PaymentStatusType),
        paidAt: isPaid ? new Date() : null,
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
