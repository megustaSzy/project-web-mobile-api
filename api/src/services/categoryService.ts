import prisma from "../lib/prisma";


export const categoryService = {

    async getByCategory(categoryId: number) {
        return prisma.tb_category.findMany({
            where: {
                id: categoryId
            },
            include: {
                destinations: true
            }
        })
    },

}