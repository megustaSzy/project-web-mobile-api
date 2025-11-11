import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


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

    async loginUser(email: string, password: string) {

        const user = await prisma.tb_user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error("email tidak ditemukan");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("password salah");
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
        );

        const { password: _, ...safeUser } = user;

        return { user: safeUser, token };
    },

}