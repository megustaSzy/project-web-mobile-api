import prisma from "../lib/prisma";


export const statService = {
    async getCounts () {
        const totalUsers = await prisma.tb_user.count();
        const totalDestinations = await prisma.tb_destinations.count();
        const totalCategories = await prisma.tb_category.count();

        return {
            totalUsers,
            totalDestinations,
            totalCategories
        }
    }
}