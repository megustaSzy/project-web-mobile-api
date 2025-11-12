import prisma from "../lib/prisma";

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
    }

}