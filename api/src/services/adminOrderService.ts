import prisma from "../lib/prisma"


export const adminOrderService = {

    async getAllOrders() {
        return await prisma.tb_orders.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    },

    async getOrderById(id: number) {
        const order = await prisma.tb_orders.findUnique({
            where: {
                id
            }
        });

        if(!order) throw new Error("order tidak ditemukan");
        return order
    }

}