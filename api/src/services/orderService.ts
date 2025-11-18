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
    }
}