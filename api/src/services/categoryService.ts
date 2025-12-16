import prisma from "../lib/prisma";
import { CategoryData } from "../types/category";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const categoryService = {
  async getAllCategories(page: number, limit: number) {

    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_category.count();

    const rows = await prisma.tb_category.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        // id: "asc",
        name: 'asc'
      },
      include: {
        destinations: true,
      },
    });

    return pagination.paginate({ count, rows })
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

  async addCategory(data: CategoryData) {

    const existing = await prisma.tb_category.findFirst({
      where: {
        name: data.name
      }
    });

    if(existing) createError("nama category sudah ada", 400)

    return prisma.tb_category.create({
      data: {
        name: data.name,
      },
      include: {
        destinations: true,
      },
    });
  },

  async editCategory(id: number, data: CategoryData) {
    const category = await prisma.tb_category.findUnique({
      where: {
        id
      }
    });

    if(!category) createError("id tidak ditemukan", 404);

    return prisma.tb_category.update({
      where: {
        id
      },
      data
    })
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
