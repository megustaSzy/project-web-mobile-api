import prisma from "../lib/prisma";
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
  async createOrder(userId: number, scheduleId: number, quantity: number) {
    if (quantity <= 0) throw createError("quantity minimal 1", 400);

    const user = await prisma.tb_user.findUnique({ where: { id: userId } });
    if (!user) throw createError("user tidak ditemukan", 404);

    const schedule = await prisma.tb_schedules.findUnique({
      where: { id: scheduleId },
      include: { destination: true },
    });
    if (!schedule) throw createError("jadwal tidak ditemukan", 404);

    const existingOrder = await prisma.tb_orders.findFirst({
      where: { userId, scheduleId },
    });
    if (existingOrder)
      throw createError("anda sudah memesan jadwal ini sebelumnya", 400);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(schedule.date) < today)
      throw createError("jadwal sudah lewat", 400);

    const totalPrice = schedule.destination.price * quantity;
    const ticketCode = `TICKET-${Date.now()}-${uuidv4()
      .slice(0, 6)
      .toUpperCase()}`;

    const order = await prisma.tb_orders.create({
      data: {
        userId,
        scheduleId,
        quantity,
        totalPrice,
        userName: user.name,
        userPhone: user.notelp ?? "",
        destinationName: schedule.destination.name,
        destinationPrice: schedule.destination.price,
        date: schedule.date,
        time: schedule.time,
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
