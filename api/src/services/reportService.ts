// src/services/report.service.ts
import { prisma } from "../lib/prisma";

export const reportService = {
  async getSalesReport(startDate: Date, endDate: Date) {
    const orders = await prisma.tb_orders.findMany({
      where: {
        isPaid: true,
        paidAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        paidAt: "asc",
      },
    });

    // summary
    const totalOrders = orders.length;
    const totalTickets = orders.reduce((s, o) => s + o.quantity, 0);
    const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
    const avgOrderValue =
      totalOrders === 0 ? 0 : Math.round(totalRevenue / totalOrders);

    // daily
    const dailyMap: Record<string, { orders: number; revenue: number }> = {};

    orders.forEach((o) => {
      const day = o.paidAt!.toISOString().split("T")[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { orders: 0, revenue: 0 };
      }
      dailyMap[day].orders += 1;
      dailyMap[day].revenue += o.totalPrice;
    });

    const dailyStats = Object.entries(dailyMap).map(([date, val]) => ({
      date,
      orders: val.orders,
      revenue: val.revenue,
    }));

    // by destination
    const byDestination = await prisma.tb_orders.groupBy({
      by: ["destinationName"],
      where: {
        isPaid: true,
        paidAt: { gte: startDate, lte: endDate },
      },
      _sum: {
        totalPrice: true,
        quantity: true,
      },
      _count: {
        id: true,
      },
    });

    //payment method
    const byPaymentMethod = await prisma.tb_orders.groupBy({
      by: ["paymentMethod"],
      where: {
        isPaid: true,
        paidAt: { gte: startDate, lte: endDate },
      },
      _sum: { totalPrice: true },
      _count: { id: true },
    });

    // payment status
    const paymentStatus = await prisma.tb_orders.groupBy({
      by: ["paymentStatus"],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
    });

    return {
      header: {
        startDate,
        endDate,
        generatedAt: new Date(),
      },
      summary: {
        totalOrders,
        totalTickets,
        totalRevenue,
        avgOrderValue,
      },
      dailyStats,
      byDestination,
      byPaymentMethod,
      paymentStatus,
      transactions: orders,
    };
  },
};
