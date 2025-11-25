import prisma from "../lib/prisma";
import { CategoryData } from "../types/category";


export const categoryService = {

    async getByCategory() {
        return prisma.tb_category.findMany({
            orderBy: {
                id: 'asc'
            },
            include: {
                destinations: true
            }
        })
    },

    async addCategory(data: CategoryData) {
        return prisma.tb_category.create({
            data: {
                name: data.name
            },
            include: {
                destinations: true
            }
        })
    }

}