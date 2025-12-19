import prisma from "../lib/prisma";
import { CreateOrderInput } from "../schemas/createOrderSchema";
import { createError } from "../utilities/createError";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export const orderService = {
  async createOrder({
    userId,
    destinationId,
    pickupLocationId,
    quantity,
    date,
    departureTime, 
    returnTime,
  }: CreateOrderInput & { userId: number }) {
    const user = await prisma.tb_user.findUnique({
      where: { id: userId },
    });
    if (!user) throw createError("User tidak ditemukan", 404);

    const destination = await prisma.tb_destinations.findUnique({
      where: { id: destinationId },
    });
    if (!destination) throw createError("Destinasi tidak ditemukan", 404);

    const pickup = await prisma.tb_pickup_locations.findUnique({
      where: { id: pickupLocationId },
    });
    if (!pickup) throw createError("Lokasi penjemputan tidak ditemukan", 404);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDate = new Date(date);
    orderDate.setHours(0, 0, 0, 0);

    if (orderDate < today) {
      throw createError("Tanggal keberangkatan tidak boleh di masa lalu", 400);
    }

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
        userPhone: user.notelp ?? "", // Pastikan field ini sesuai model user kamu
        userEmail: user.email,

        destinationName: destination.name,
        destinationPrice: destination.price,
        pickupLocationName: pickup.name,

        date: orderDate,
        departureTime: departureTime, // Sesuai schema
        returnTime: returnTime,

        ticketCode,
        paymentOrderId,
        paymentStatus: PaymentStatus.pending, // Pakai Enum Prisma
        isPaid: false,
      },
    });

    return order;
  },

  async getOrderByPaymentOrderId(paymentOrderId: string) {
    return await prisma.tb_orders.findUnique({
      where: { paymentOrderId },
    });
  },
  async getOrdersByUser(userId: number) {
    return await prisma.tb_orders.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // Lebih baik urutkan berdasarkan waktu buat
      select: {
        id: true,
        destinationName: true,
        pickupLocationName: true,
        date: true,
        departureTime: true, // Sesuai schema (sebelumnya 'time')
        returnTime: true,
        quantity: true,
        totalPrice: true,
        paymentStatus: true,
        isPaid: true,
        ticketCode: true, // Berguna untuk ditampilkan di UI
        createdAt: true,
      },
    });
  },

  async getOrderById(id: number, userId: number) {
    const order = await prisma.tb_orders.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        destination: true,
        pickupLocation: true,
      },
    });

    if (!order) {
      throw createError("Order tidak ditemukan", 404);
    }

    return order;
  },

  async updateOrderPaymentData(
    orderId: number,
    data: {
      paymentOrderId?: string;
      snapToken?: string;
      snapRedirectUrl?: string;
      transactionId?: string;
      paymentStatus?: PaymentStatus; 
      paymentMethod?: PaymentMethod; 
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
