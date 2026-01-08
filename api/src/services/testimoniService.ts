import prisma from "../lib/prisma";
import { TestimoniData } from "../schemas/testimoniSchema";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const testimoniService = {
  async getAllTestimoni(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const [count, rows] = await Promise.all([
      prisma.tb_testimoni.count(),
      prisma.tb_testimoni.findMany({
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {
          id: "asc",
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
  },

  async getApprovedTestimoni(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_testimoni.count({
      where: {
        approvalStatus: "APPROVED",
      },
    });

    const rows = await prisma.tb_testimoni.findMany({
      where: {
        approvalStatus: "APPROVED",
      },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return pagination.paginate({ count, rows });
  },

  async getPendingTestimoni(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_testimoni.count({
      where: {
        approvalStatus: "PENDING",
      },
    });

    const rows = await prisma.tb_testimoni.findMany({
      where: {
        approvalStatus: "PENDING",
      },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return pagination.paginate({ count, rows });
  },

  async createTestimoni(data: TestimoniData) {
    const testimoni = await prisma.tb_testimoni.create({
      data,
    });

    return testimoni;
  },

  async getByIdTestimoni(id: number) {
    const testimoni = await prisma.tb_testimoni.findUnique({
      where: {
        id,
      },
    });

    if (!testimoni) throw createError("id tidak ditemukan", 404);

    return testimoni;
  },

  async editTestimoni(id: number, userId: number, data: TestimoniData) {
    // cek testimoni
    const testimoni = await prisma.tb_testimoni.findUnique({
      where: { id },
    });

    if (!testimoni) throw createError("testimoni tidak ditemukan", 404);

    return prisma.tb_testimoni.update({
      where: { id },
      data: {
        approvalStatus: "PENDING",
      },
    });
  },

  async approveTestimoni(id: number) {
    const testimoni = await prisma.tb_testimoni.findUnique({
      where: {
        id,
      },
    });

    if (!testimoni) throw createError("id tidak ditemukan", 404);

    return prisma.tb_testimoni.update({
      where: {
        id,
      },
      data: {
        approvalStatus: "APPROVED",
      },
    });
  },

  async rejectedTestimoni(id: number) {
    const testimoni = await prisma.tb_testimoni.findUnique({
      where: {
        id,
      },
    });

    if (!testimoni) throw createError("id tidak ditemukan", 404);

    return prisma.tb_testimoni.update({
      where: {
        id,
      },
      data: {
        approvalStatus: "REJECTED",
      },
    });
  },

  async deleteTestimoni(id: number) {
    const testimoni = await prisma.tb_testimoni.findFirst({
      where: {
        id,
      },
    });

    if (!testimoni) throw createError("id tidak ditemukan", 404);

    return prisma.tb_testimoni.delete({
      where: {
        id,
      },
    });
  },
};
