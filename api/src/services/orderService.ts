import prisma from "../lib/prisma";



export const orderService = {
    async createOrder(userId: number, scheduleId: number, tickets: number) {

        const user = await prisma.tb_user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) throw new Error("User tidak ditemukan");

        // ambil jadwal +destinasi

        const schedule = await prisma.tb_schedules.findUnique({
            where: {
                id: scheduleId
            },
            include: {
                destination: true
            }
        })

        if(!schedule) throw new Error("jadwal tidak ditemukan");

        // hitung total harga
        const totalPrice = schedule.destination.price * tickets;

        // insert ke tb orders
        const order = await prisma.tb_orders.create({
            data: {
                userId,
                scheduleId,
                tickets,
                totalPrice,

                userName: user.name,
                userPhone: user.notelp,


                destinationName: schedule.destination.name,
                destinationPrice: schedule.destination.price,


                // snapshot jadwal
                date: schedule.date,
                time: schedule.time
            }
        });

        return order
    },

    async getOrdersByUser(userId: number) {
        return await prisma.tb_orders.findMany({
            where: {
                userId
            },
            orderBy: {
                id: 'asc'
            }
        })
    }
}