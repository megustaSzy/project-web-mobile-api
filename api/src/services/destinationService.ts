import prisma from "../lib/prisma";
import { createError } from "../utils/createError";

interface DestinationData{
    name: string,
    location: string,
    imageUrl: string,
    description: string,
    price: number,
    category: string
}

export const destinationService = {

    async getAllDestinations() {
        return prisma.tb_destinations.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    },

    async getDestinationById(id: number) {
        return prisma.tb_destinations.findUnique({
            where: {
                id
            }
        });
    },

    async addDestination(data: DestinationData) {

        const existingDestination = await prisma.tb_destinations.findFirst({
            where: {
                name: data.name
            }
        });

        if(existingDestination) throw new Error("nama pantai sudah ada");

        return prisma.tb_destinations.create({
            data: {
                name: data.name,
                location: data.location,
                imageUrl: data.imageUrl,
                description: data.description,
                price: data.price,
                category: data.category
            }
        });
    },

    async editDestination(id: number, data: DestinationData) {
        
        const destination = await prisma.tb_destinations.findUnique({
            where: {
                id
            }
        });

        if(!destination) createError("id tidak ditemukan", 404);

        return prisma.tb_destinations.update({
            where: {
                id
            },
            data
        })

    },

    async deleteDestinationById(id: number) {
        const destinationId = await prisma.tb_destinations.findFirst({
            where: {
                id
            }
        });

        if(!destinationId) createError("id tidak ditemukan", 404);

        return prisma.tb_destinations.delete({
            where: {
                id
            }
        })
    }

}