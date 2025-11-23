import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { createError } from "../utilities/createError";

interface UserData {
  name: string;
  email: string;
  password?: string; // opsional saat update
  notelp: string;
  role: "Admin" | "User";
}

export const userService = {
  // GET all users
  // Mengambil semua user dari database
  async getAllUsers() {
    return prisma.tb_user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  },

  // GET user by ID
  // Mengambil user berdasarkan ID
  async getUserById(id: number) {
    const user = await prisma.tb_user.findUnique({
      where: { id },
    });

    if (!user) createError("id tidak ditemukan", 404);

    return user;
  },

  // UPDATE user by ID
  // Mengubah data user berdasarkan ID
  async updateUserById(id: number, data: UserData) {
    const user = await prisma.tb_user.findUnique({
      where: { id },
    });

    if (!user) createError("id tidak ditemukan", 404);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.tb_user.update({
      where: { id },
      data,
    });
  },

  // DELETE user by ID
  // Menghapus user berdasarkan ID
  async deleteUserById(id: number) {
    const user = await prisma.tb_user.findUnique({
      where: { id },
    });

    if (!user) createError("id tidak ditemukan", 404);

    return prisma.tb_user.delete({
      where: { id },
    });
  },
};
