import prisma from "../lib/prisma";
import { CategoryData } from "../types/category";
import { createError } from "../utilities/createError";

export const categoryService = {
  async getAllCategories() {
    return prisma.tb_category.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        destinations: true,
      },
    });
  },

};
