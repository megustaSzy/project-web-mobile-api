import prisma from "../lib/prisma";
import { CreateOrderInput } from "../schemas/createOrderSchema";
import { createError } from "../utilities/createError";
import { v4 as uuidv4 } from "uuid";

type PaymentStatusType = "pending" | "paid" | "failed" | "expired";

export const orderService = {
  async createOrder({
    userId,
    destinationId,
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDate = new Date(date);
    orderDate.setHours(0, 0, 0, 0);

    if (orderDate < today) {
      throw createError("tanggal keberangkatan sudah lewat", 400);
    }

    const existingOrder = await prisma.tb_orders.findFirst({
      where: {
        userId,
        date: orderDate,
      },
    });

    if (existingOrder) {
      throw createError("anda sudah memiliki pesanan di tanggal ini", 400);
    }

    const totalPrice = destination.price * quantity;

    const ticketCode = `TICKET-${uuidv4().slice(0, 8).toUpperCase()}`;
    const paymentOrderId = `ORDER-${Date.now()}-${uuidv4().slice(0, 8)}`;

    return prisma.tb_orders.create({
      data: {
        userId,
        quantity,
        totalPrice,

        userName: user.name,
        userPhone: user.notelp ?? "",
        userEmail: user.email,

        destinationName: destination.name,
        destinationPrice: destination.price,

        date: orderDate,
        time,
        returnTime,

        ticketCode,
        paymentOrderId,

        paymentStatus: "pending" as PaymentStatusType,
        isPaid: false,
      },
    });
  },

  async getOrdersByUser(userId: number) {
    return prisma.tb_orders.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getOrderById(id: number, userId: number) {
    const order = await prisma.tb_orders.findFirst({
      where: { id, userId },
    });

    if (!order) throw createError("order tidak ditemukan", 404);
    return order;
  },

  async findByPaymentOrderId(paymentOrderId: string) {
    return prisma.tb_orders.findUnique({
      where: { paymentOrderId },
    });
  },

  async updateOrderPaymentData(
    orderId: number,
    data: {
      snapToken?: string;
      snapRedirectUrl?: string;
      transactionId?: string;
      paymentStatus?: PaymentStatusType;
      paymentMethod?: any;
      isPaid?: boolean;
      paidAt?: Date;
    }
  ) {
    return prisma.tb_orders.update({
      where: { id: orderId },
      data,
    });
  },
};
