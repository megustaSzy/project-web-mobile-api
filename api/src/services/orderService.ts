import prisma from "../lib/prisma";
import { CreateOrderInput } from "../schemas/createOrderSchema";
import { createError } from "../utilities/createError";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { Pagination } from "../utilities/Pagination";

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
      where: {
        id: userId,
      },
      select: {
        // add select
        id: true,
        name: true,
        email: true,
        notelp: true,
      },
    });
    if (!user) throw createError("User tidak ditemukan", 404);

    const destination = await prisma.tb_destinations.findUnique({
      where: { id: destinationId },
      select: {
        // add select destination
        id: true,
        name: true,
        price: true,
      },
    });
    if (!destination) throw createError("Destinasi tidak ditemukan", 404);

    let pickupName = "";
    if (pickupLocationId) {
      const pickup = await prisma.tb_pickup_locations.findUnique({
        where: { id: pickupLocationId },
        select: {
          id: true,
          name: true,
        },
      });
      if (!pickup) throw createError("Lokasi penjemputan tidak ditemukan", 404);
      pickupName = pickup.name;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDate = new Date(date);
    orderDate.setHours(0, 0, 0, 0);

    if (orderDate < today)
      throw createError("Tanggal keberangkatan tidak boleh di masa lalu", 400);

    if (returnTime && returnTime <= departureTime) {
      throw createError(
        "Waktu pulang harus lebih besar dari waktu berangkat",
        400,
      );
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
        pickupLocationId: pickupLocationId ?? null,
        quantity,
        totalPrice,

        userName: user.name,
        userPhone: user.notelp ?? "",
        userEmail: user.email,

        destinationName: destination.name,
        destinationPrice: destination.price,
        pickupLocationName: pickupName,

        date: orderDate,
        departureTime,
        returnTime: returnTime ?? null,

        ticketCode,
        paymentOrderId,
        paymentStatus: PaymentStatus.pending,
        isPaid: false,
      },
    });

    return order;
  },
  async getOrderByPaymentOrderId(paymentOrderId: string) {
    return await prisma.tb_orders.findUnique({
      where: { paymentOrderId },
      select: {
        id: true,
        userId: true,

        userEmail: true,
        userName: true,
        ticketCode: true,

        totalPrice: true,
        paymentStatus: true,
        paymentMethod: true,
        isPaid: true,
        paidAt: true,
        snapToken: true,
        snapRedirectUrl: true,
        transactionId: true,
      },
    });
  },
  async getOrdersByUser(userId: number, page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const where = { userId };

    const [count, rows] = await Promise.all([
      prisma.tb_orders.count({
        where,
      }),
      prisma.tb_orders.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: pagination.offset,
        take: pagination.limit,
        select: {
          id: true,
          destinationName: true,
          pickupLocationName: true,
          date: true,
          departureTime: true,
          returnTime: true,
          quantity: true,
          totalPrice: true,
          paymentStatus: true,
          isPaid: true,
          ticketCode: true,
          createdAt: true,
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
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
    },
  ) {
    return await prisma.tb_orders.update({
      where: { id: orderId },
      data,
      select: {
        id: true,
      },
    });
  },
};
