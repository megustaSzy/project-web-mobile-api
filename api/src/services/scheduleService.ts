
import prisma from "../lib/prisma"

interface ScheduleData{
    pickupLocationId: number,
    destinationId: number,
    time: string,
    date: string
}

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

    async getScheduleById(id: number) {
        return prisma.tb_schedules.findUnique({
            where: {
                id
            },
            include: {
                pickupLocation: true,
                destination: true
            }
        })
    },

    async createSchedule(data: ScheduleData) {
        return prisma.tb_schedules.create({
            data: {
                pickupLocationId: data.pickupLocationId,
                destinationId: data.destinationId,
                time: data.time,
                date: data.date
            }
        });
    },

    async updateSchedule(id: number, data: ScheduleData) {
        return prisma.tb_schedules.update({
            where: {
                id
            },
            data: {
                pickupLocationId: data.pickupLocationId,
                destinationId: data.destinationId,
                time: data.time,
                date: data.date
            }
        });
    },

    async deleteSchedule (id: number) {
        return prisma.tb_schedules.delete({
            where: {
                id
            }
        })
    },

    async searchSchedule(filters: ScheduleData) {

        const { pickupLocationId, destinationId, time, date } = filters

        return prisma.tb_schedules.findMany({
            where: {
                pickupLocationId: pickupLocationId || undefined,
                destinationId: destinationId || undefined,
                date: date || undefined,
                time: time || undefined
            },
            include: {
                pickupLocation: true,
                destination: true
            },
            orderBy: {
                id: 'asc'
            }
        })
    }

}