import prisma from "../lib/prisma";

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



}