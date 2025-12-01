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
        id: "asc" 
      },
    });

    return pagination.paginate({ count, rows })
  },


  // Mengambil detail order berdasarkan ID
  async getOrderById(id: number) {
    const order = await prisma.tb_orders.findUnique({ where: { id } });
    if (!order) createError("order tidak ditemukan", 404);

    return order;
  },


  // Menghapus order berdasarkan ID
  async deleteById(id: number) {
    const order = await prisma.tb_orders.findUnique({ 
      where: { 
        id 
      } 
    });

    if (!order) createError("order tidak ditemukan", 404);

    return prisma.tb_orders.delete({ where: { id } });
  },
};
