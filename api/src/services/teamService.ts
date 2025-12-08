import prisma from "../lib/prisma";

export const teamService = {

    async getTeam() {
        return prisma.tb_ourTeam.findMany({
            orderBy: {
                id: 'desc'
            }
        });
    },

    async createTeam() {

        

    }

}