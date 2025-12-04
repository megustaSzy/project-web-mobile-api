import prisma from "../lib/prisma";


export const statService = {
    async getCounts () {
        const users = await prisma.tb_user.count();
        const destinations = await prisma.tb_destinations.count();
        const categories = await prisma.tb_category.count();

        return {
            users,
            destinations,
            categories
        }
    }
}