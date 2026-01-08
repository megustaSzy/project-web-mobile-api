import prisma from "../lib/prisma";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../schemas/categorySchema";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const categoryService = {
  async getAllCategories(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const [count, rows] = await Promise.all([
      prisma.tb_category.count(),
      prisma.tb_category.findMany({
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {
          // id: "asc",
          name: "asc",
        },
        include: {
          destinations: true,
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
  },

  async getCategoryById(id: number) {
    const category = await prisma.tb_category.findFirst({
      where: {
        id,
      },
      include: {
        destinations: true,
      },
    });

    if (!category) createError("id tidak ditemukan", 404);

    return category;
  },

  async addCategory(data: CreateCategoryDTO) {
    const existing = await prisma.tb_category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existing) throw createError("nama category sudah ada", 400);

    return prisma.tb_category.create({
      data: {
        name: data.name,
      },
      include: {
        destinations: true,
      },
    });
  },

  async editCategory(id: number, data: UpdateCategoryDTO) {
    const category = await prisma.tb_category.findUnique({
      where: {
        id,
      },
    });

    if (!category) throw createError("id tidak ditemukan", 404);

    return prisma.tb_category.update({
      where: {
        id,
      },
      data,
    });
  },

  async deleteCategoriesById(id: number) {
    const category = await prisma.tb_category.findUnique({
      where: {
        id,
      },
    });

    if (!category) createError("id tidak ditemukan", 404);

    return prisma.tb_category.delete({
      where: {
        id,
      },
    });
  },
};
