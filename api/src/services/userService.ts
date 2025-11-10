import prisma from "../lib/prisma";
import { createError } from "../utils/createError";


interface UserData{
    name: string;
    email: string;
    password: string;
    notelp: string;
    role: "Admin" | "User";
}

export const userService = {

    // GET all
    async getAllUsers() {
        return prisma.tb_user.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    },

    async getUserById(id: number) {
        return prisma.tb_user.findUnique({
            where: {
                id
            }
        });
    },

    async updateUserById(id: number, data: UserData) {
        
        const user = await prisma.tb_user.findUnique({
            where: {
                id
            }
        });

        if(!user) createError("user tidak ditemukan", 404);

        return prisma.tb_user.update({
            where: {
                id
            },
            data
        })
    }

}