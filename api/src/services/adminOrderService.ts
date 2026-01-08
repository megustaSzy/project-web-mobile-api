import prisma from "../lib/prisma";
import { CreateAdminOrderInput } from "../schemas/createAdminOrderSchema";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "@prisma/client";

export const adminOrderService = {
  async createOrder(input: CreateAdminOrderInput) {
    const {
      userId,
      destinationId,
      pickupLocationId,
      quantity,
      date,
      departureTime,
      returnTime,
      isPaid = false,
    } = input;

    const user = await prisma.tb_user.findUnique({ where: { id: userId } });
    if (!user) throw createError("user tidak ditemukan", 404);

    const destination = await prisma.tb_destinations.findUnique({
      where: { id: destinationId },
    });
    if (!destination) throw createError("destinasi tidak ditemukan", 404);

    let pickupLocationName = "";
    if (pickupLocationId !== undefined) {
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
    const paymentOrderId = `ORDER-${Date.now()}-${uuidv4()
      .slice(0, 8)
      .toUpperCase()}`;

    const order = await prisma.tb_orders.create({
      data: {
        userId,
        destinationId,
        pickupLocationId,
        quantity,
        totalPrice,

        userName: user.name,
        userPhone: user.notelp ?? "",
        userEmail: user.email,

        destinationName: destination.name,
        destinationPrice: destination.price,
        pickupLocationName,

        date: orderDate,
        departureTime: departureTime,
        returnTime: returnTime,

        ticketCode,
        isPaid,
        paymentOrderId,
        paymentStatus: isPaid ? PaymentStatus.paid : PaymentStatus.pending,
        paidAt: isPaid ? new Date() : undefined,
      },
    });

    return order;
  },

  async getAllOrders(page: number, limit: number) {
    const pagination = new Pagination(page, limit);
    const [count, rows] = await Promise.all([
      prisma.tb_orders.count(),
      prisma.tb_orders.findMany({
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
      }),
    ]);
    return pagination.paginate({ count, rows });
  },
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
