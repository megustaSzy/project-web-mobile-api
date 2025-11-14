import prisma from "../lib/prisma"

interface PickupData{
    name: string
}

export const pickupLocation = {

    // GET all pickup
    async getAllPickups() {
        return prisma.tb_pickup_locations.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    },

    // get by id
    async getPickupById(id: number) {
        return prisma.tb_pickup_locations.findUnique({
            where: {
                id
            }
        })
    },

    // ADD pickup
    async addPickupLocation(data: PickupData) {
        return prisma.tb_pickup_locations.create({
            data: {
                name: data.name
            }
        })
    },

    
    async deletePickupById(id: number) {
        return prisma.tb_pickup_locations.delete({
            where:{
                id
            }
        })
    }
}