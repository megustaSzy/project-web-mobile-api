import prisma from "../lib/prisma";
import { CreateOrderInput } from "../schemas/createOrderSchema";
import { createError } from "../utilities/createError";
import { v4 as uuidv4 } from "uuid";

// Enum tipe sesuai Prisma
type PaymentStatusType = "pending" | "paid" | "failed" | "expired";
type PaymentMethodType =
  | "gopay"
  | "bank_transfer"
  | "qris"
  | "credit_card"
  | null;

export const orderService = {
  async createOrder({
    userId,
    destinationId,
    pickupLocationId,
    quantity,
    date,
    time,
    returnTime,
  }: CreateOrderInput & { userId: number }) {
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

    const existingOrder = await prisma.tb_orders.findUnique({
      where: {
        userId_date: {
          userId,
          date: orderDate,
        },
      },
    });

    if (existingOrder)
      throw createError("anda sudah memiliki pesanan di tanggal ini", 400);

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
        isPaid: false,
        paymentStatus: "pending" as PaymentStatusType,
      },
    });

    return order;
  },
  async getOrdersByUser(userId: number) {
    return await prisma.tb_orders.findMany({
      where: { userId },
      orderBy: { id: "desc" },
    });
  },

  async getOrderById(id: number, userId: number) {
    const order = await prisma.tb_orders.findUnique({ where: { id } });
    if (!order) throw createError("order tidak ditemukan", 404);
    if (order.userId !== userId)
      throw createError("anda tidak memiliki akses ke order ini", 403);
    return order;
  },

  async updateOrderPaymentData(
    orderId: number,
    data: {
      snapToken?: string;
      snapRedirectUrl?: string;
      transactionId?: string;
      paymentStatus?: PaymentStatusType;
      paymentMethod?: PaymentMethodType;
      isPaid?: boolean;
      paidAt?: Date;
    }
  ) {
    return await prisma.tb_orders.update({
      where: { id: orderId },
      data,
    });
  },
};
