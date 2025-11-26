import prisma from "../lib/prisma";
import { CategoryData } from "../types/category";
import { createError } from "../utilities/createError";


export const categoryService = {

    async getAllCategories() {
        return prisma.tb_category.findMany({
            orderBy: {
                id: 'asc'
            },
            include: {
                destinations: true
            }
        })
    },

    async getCategoryById(id: number) {

        const category = await prisma.tb_category.findFirst({
            where: {
                id
            },
            include: {
                destinations: true
            }
        });

        if(!category) createError("id tidak ditemukan", 404);

        return category
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
    },

    async deleteCategoriesById(id: number) {
        const category = await prisma.tb_category.findUnique({
            where: {
                id
            }
        })
        
        if(!category) createError("id tidak ditemukan", 404)
        
        return prisma.tb_category.delete({
            where: {
                id
            }
        });
        
    }
}