import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const adminOrderService = {
  // Mengambil semua order
  async getAllOrders(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_orders.count();

    const rows = await prisma.tb_orders.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        id: "desc", // biasanya admin ingin terbaru dulu
      },
      // Bila ingin include user dan schedule asli:
      // include: { user: true, schedule: true }
    });

    return pagination.paginate({ count, rows });
  },

  // Detail order (admin)
  async getOrderById(id: number) {
    const order = await prisma.tb_orders.findUnique({
      where: { id },
    });

    if (!order) throw createError("order tidak ditemukan", 404);

    return order;
  },

  // Hapus order (admin)
  async deleteById(id: number) {
    const existing = await prisma.tb_orders.findUnique({
      where: { id },
    });

    if (!existing) throw createError("order tidak ditemukan", 404);

    try {
      const deleted = await prisma.tb_orders.delete({ where: { id } });
      return deleted;
    } catch (err: any) {
      // Jika ada FK constraint dari table lain
      throw createError(
        "order tidak dapat dihapus karena masih memiliki relasi",
        409
      );
    }
  },
};
