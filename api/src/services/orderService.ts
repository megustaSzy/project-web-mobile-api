import prisma from "../lib/prisma";

export const orderService = {
    // ==========================
    // CREATE ORDER
    // ==========================
    async createOrder(userId: number, scheduleId: number, tickets: number) {

        // Pastikan user ada
        const user = await prisma.tb_user.findUnique({
            where: { id: userId }
        });

        if (!user) throw new Error("User tidak ditemukan");

        // Ambil jadwal + destinasi
        const schedule = await prisma.tb_schedules.findUnique({
            where: { id: scheduleId },
            include: {
                destination: true
            }
        });

        if (!schedule) throw new Error("Jadwal tidak ditemukan");

        // Hitung total harga
        const totalPrice = schedule.destination.price * tickets;

        // Simpan ke database (snapshot data)
        const order = await prisma.tb_orders.create({
            data: {
                userId,
                scheduleId,

                tickets,
                totalPrice,

                // snapshot user
                userName: user.name,
                userPhone: user.notelp,

                // snapshot destinasi
                destinationName: schedule.destination.name,
                destinationPrice: schedule.destination.price,

                // snapshot schedule
                date: schedule.date,
                time: schedule.time
            }
        });

        return order;
    },

    // ==========================
    // GET MY ORDERS
    // ==========================
    async getOrdersByUser(userId: number) {
        return await prisma.tb_orders.findMany({
            where: { userId },
            orderBy: {
                id: "desc" // urutkan dari terbaru
            }
        });
    },

    // ==========================
    // GET ORDER BY ID
    // ==========================
    async getOrderById(id: number) {
        const order = await prisma.tb_orders.findUnique({
            where: { id }
        });

        if (!order) throw new Error("Order tidak ditemukan");

        return order;
    }
};
