import prisma from "../lib/prisma"


export const adminOrderService = {

    async getAllOrders() {
        return await prisma.tb_orders.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    },

    

}