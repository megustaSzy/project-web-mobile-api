import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";
import { UpdateUserData } from "../schemas/updateSchema";

export const userService = {
  // GET all users
  async getAllUsers(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const count = await prisma.tb_user.count();

    const rows = await prisma.tb_user.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where: {
        role: "User",
      },
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        notelp: true,
        avatar: true,
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
        avatar: true,
      },
    });

    if (!user) createError("id tidak ditemukan", 404);

    return user;
  },

  // UPDATE user by ID
  async updateUserById(id: number, data: UpdateUserData) {
    const existingUser = await prisma.tb_user.findUnique({ where: { id } });
    if (!existingUser) {
      throw createError("id tidak ditemukan", 404);
    }

    if (data.email) {
      const emailExist = await prisma.tb_user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (emailExist) {
        throw createError("email sudah digunakan", 400);
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
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
