import prisma from "../lib/prisma"
import { createError } from "../utils/createError"

interface PickupData{
    name: string
}

export const pickupLocationService = {

    // GET all pickup
    async getAllPickups() {
        return prisma.tb_pickup_locations.findMany({
            orderBy: {
                id: 'asc'
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
    async createPickupLocation(data: PickupData) {
        return prisma.tb_pickup_locations.create({
            data: {
                name: data.name
            }
        })
    },

    // EDIT pickup
    async editPickupLocation(id: number, data: PickupData) {
        const pickup = await prisma.tb_pickup_locations.findFirst({
            where: {
                id
            }
        });

        if(!pickup) createError("id tidak ditemukan", 404);

        return prisma.tb_pickup_locations.update({
            where: {
                id
            },
            data
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