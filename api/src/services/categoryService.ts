import prisma from "../lib/prisma";


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

}