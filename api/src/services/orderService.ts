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
    // Ambil user
    const user = await prisma.tb_user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, notelp: true },
    });
    if (!user) throw createError("User tidak ditemukan", 404);

    // Ambil destinasi
    const destination = await prisma.tb_destinations.findUnique({
      where: { id: destinationId },
      select: { id: true, name: true, price: true },
    });
    if (!destination) throw createError("Destinasi tidak ditemukan", 404);

    // Ambil lokasi penjemputan (opsional)
    let pickupName = "";
    if (pickupLocationId) {
      const pickup = await prisma.tb_pickup_locations.findUnique({
        where: { id: pickupLocationId },
        select: { id: true, name: true },
      });
      if (!pickup) throw createError("Lokasi penjemputan tidak ditemukan", 404);
      pickupName = pickup.name;
    }

    // Validasi tanggal tidak boleh di masa lalu
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDate = new Date(date);
    orderDate.setHours(0, 0, 0, 0);

    if (orderDate < today)
      throw createError("Tanggal keberangkatan tidak boleh di masa lalu", 400);

    // Validasi jam berangkat dan pulang
    const allowedDepartTimes = [
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
    ];
    const allowedReturnTimes = ["15:00", "16:00", "17:00", "18:00"];

    if (!allowedDepartTimes.includes(departureTime)) {
      throw createError(
        `Waktu berangkat harus salah satu dari: ${allowedDepartTimes.join(", ")}`,
        400,
      );
    }

    if (returnTime && !allowedReturnTimes.includes(returnTime)) {
      throw createError(
        `Waktu pulang harus salah satu dari: ${allowedReturnTimes.join(", ")}`,
        400,
      );
    }

    // Validasi waktu pulang > berangkat
    if (returnTime && returnTime <= departureTime) {
      throw createError(
        "Waktu pulang harus lebih besar dari waktu berangkat",
        400,
      );
    }

    // Hitung total harga
    const totalPrice = destination.price * quantity;

    // Generate kode tiket & order
    const ticketCode = `TICKET-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    const paymentOrderId = `ORDER-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Simpan order
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

    const where = {
      userId,
      paymentStatus: PaymentStatus.paid, // hanya tiket yang sudah dibayar
    };

    const [count, rows] = await Promise.all([
      prisma.tb_orders.count({ where }),
      prisma.tb_orders.findMany({
        where,
        orderBy: { createdAt: "desc" },
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
