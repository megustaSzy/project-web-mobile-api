import prisma from "../lib/prisma";


export const userService = {

    // GET all
    async getAllUsers() {
        return prisma.tb_user.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

}