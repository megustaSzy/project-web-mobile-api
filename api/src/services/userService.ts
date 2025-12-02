import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { createError } from "../utilities/createError";
import { UserData } from "../types/user";
import { Pagination } from "../utilities/Pagination";

export const userService = {
  // GET all users
  async getAllUsers(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_user.count();

    const rows = await prisma.tb_user.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        notelp: true,
      },
    });

    return pagination.paginate({ count, rows });
  },

  // GET user by ID
  async getUserById(id: number) {
    const user = await prisma.tb_user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        notelp: true,
      },
    });

    if (!user) createError("id tidak ditemukan", 404);

    return user;
  },

  // UPDATE user by ID
  async updateUserById(id: number, data: UserData) {
    const existingUser = await prisma.tb_user.findUnique({
      where: { id },
    });

    if (!existingUser) createError("id tidak ditemukan", 404);

    //cek duplikat email
    if(data.email) {
      const emailExist = await prisma.tb_user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id
          }
        }
      });

      if(emailExist) createError("email sudah digunakan", 400)
    }

    if (data.password) {
      if(data.password.length < 6) createError ("password minimal 6 karakter", 400);
      data.password = await bcrypt.hash(data.password, 10)
    }

    return prisma.tb_user.update({
      where: { id },
      data,
    });
  },

  // DELETE user by ID
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
