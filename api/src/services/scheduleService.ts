import prisma from "../lib/prisma"



export const scheduleService = {

    // Get ALL schedule
    async getAllSchedules() {

        return prisma.tb_schedules.findMany({
            include: {
                pickupLocation: true,
                destination: true
            },
            orderBy: {
                date: 'asc'
            }
        });
    },

    

}