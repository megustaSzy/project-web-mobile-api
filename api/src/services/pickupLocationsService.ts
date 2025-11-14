import prisma from "../lib/prisma"



export const pickupLocation = {

    async getAllPickups() {
        return prisma.tb_pickup_locations.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    },

}