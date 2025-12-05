import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { v4 as uuidv4 } from "uuid";

export const orderService = {
  // Membuat order baru
  async createOrder(userId: number, scheduleId: number, quantity: number) {

    if (quantity <= 0) throw createError("quantity minimal 1", 400);

    // Cek user
    const user = await prisma.tb_user.findUnique({ 
      where: { 
        id: userId 
      } 
    });

    if (!user) throw createError("user tidak ditemukan", 404);

    // Cek jadwal + destinasi
    const schedule = await prisma.tb_schedules.findUnique({
      where: { id: scheduleId },
      include: { destination: true },
    });
    if (!schedule) throw createError("jadwal tidak ditemukan", 404);

    const existingOrder = await prisma.tb_orders.findFirst({
        where: {
            userId,
            scheduleId
        }
    });

    if(existingOrder) throw createError("anda sudah memesan jadwal ini sebelumnya", 400)

    // Cek jadwal sudah lewat
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if(new Date(schedule.date) < today) throw createError("jadwal sudah lewat", 400);

    // Hitung total
    const totalPrice = schedule.destination.price * quantity;

    const ticketCode = `TICKET-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;

    // Buat order + snapshot data
    const order = await prisma.tb_orders.create({
      data: {
        userId,
        scheduleId,
        quantity,
        totalPrice,

        // snapshot user
        userName: user.name,
        userPhone: user.notelp ?? "",

        // snapshot destinasi
        destinationName: schedule.destination.name,
        destinationPrice: schedule.destination.price,

        // snapshot schedule
        date: schedule.date,
        time: schedule.time,

        // ticket snapshot
        ticketCode,
        isPaid: false,
        paymentStatus: "pending"
      },
    });

    return order;
  },

  // Riwayat order user
  async getOrdersByUser(userId: number) {
    return await prisma.tb_orders.findMany({
      where: { userId },
      orderBy: { id: "desc" },
    });
  },

  // Order detail (user)
  async getOrderById(id: number, userId: number) {
    
    const order = await prisma.tb_orders.findUnique({ where: { id } });
    if (!order) throw createError("order tidak ditemukan", 404);

    if (order.userId !== userId) throw createError("anda tidak memiliki akses ke order ini", 403);

    return order;
  },


  async markOrderAsPaid(orderId: number, transactionId: number) {
    return await prisma.tb_orders.update({
      where: {
        id: orderId
      },
      data: {
        isPaid: true,
        paymentStatus: "paid",
        transactionId: String(transactionId),
        paidAt: new Date(),
      }
    })
  },

  async updateOrderPaymentData(orderId: number, data: { snapToken?: string; snapRedirectUrl?: string }) {
    return await prisma.tb_orders.update({
      where: {
        id: orderId
      },
      data
    })
  }
};
