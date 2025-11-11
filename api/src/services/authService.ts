import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";


interface UserData {
    name: string,
    email: string,
    password: string,
    role: "Admin" | "User",
    notelp: string
}

export const authService = {

    async registerUser(data: UserData) {

        const existingUser = await prisma.tb_user.findUnique({
            where: {
                email: data.email
            }
        });

        if(existingUser) {
            throw new Error("email sudah digunakan")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.tb_user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || "User",
                notelp: data.notelp || ""
            }
        });
    },

}