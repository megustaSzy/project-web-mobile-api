import prisma from "../lib/prisma";
import { TestimoniData } from "../types/testimoni";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const testimoniService = {
  async getAllTestimoni(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_testimoni.count();

    const rows = await prisma.tb_testimoni.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return pagination.paginate({ count, rows });
  },

  async getAprovedTestimoni(page: number, limit: number) {
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
        createdAt: "asc",
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
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
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return pagination.paginate({ count, rows });
  },

  async createTestimoni(userId: number, data: TestimoniData) {
    const user = await prisma.tb_user.findUnique({
      where: { id: userId },
    });

    if (!user) throw createError("user tidak ditemukan", 404);

    const testimoni = await prisma.tb_testimoni.create({
      data: {
        userId,
        status: data.status,
        comment: data.comment,
        rating: data.rating,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return testimoni;
  },

  async getByIdTestimoni(id: number) {
    const testimoni = await prisma.tb_testimoni.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
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

    // pastikan testimoni benar milik user
    if (testimoni.userId !== userId) {
      throw createError(
        "anda tidak memiliki akses untuk mengedit testimoni ini",
        403
      );
    }

    return prisma.tb_testimoni.update({
      where: { id },
      data: {
        status: data.status,
        comment: data.comment,
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
