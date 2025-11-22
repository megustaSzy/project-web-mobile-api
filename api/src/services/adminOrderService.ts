import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";

export const adminOrderService = {
  // GET all orders
  // Mengambil semua order
  async getAllOrders() {
    return prisma.tb_orders.findMany({
      orderBy: { id: "asc" },
    });
  },

  // GET order by ID
  // Mengambil detail order berdasarkan ID
  async getOrderById(id: number) {
    const order = await prisma.tb_orders.findUnique({ where: { id } });
    if (!order) createError("Order tidak ditemukan", 404);

    return order;
  },

  // DELETE order by ID
  // Menghapus order berdasarkan ID
  async deleteById(id: number) {
    const order = await prisma.tb_orders.findUnique({ where: { id } });
    if (!order) createError("Order tidak ditemukan", 404);

    return prisma.tb_orders.delete({ where: { id } });
  },
};
