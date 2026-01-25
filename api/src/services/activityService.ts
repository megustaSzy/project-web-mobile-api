import prisma from "../lib/prisma";
import { Pagination } from "../utilities/Pagination";
import { Role } from "@prisma/client";

export const activityService = {
  async getAdminLogs(adminId: number, page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const where = {
      role: Role.Admin,
      userId: adminId,
    };

    const [count, rows] = await Promise.all([
      prisma.tb_activity_logs.count({ where }),
      prisma.tb_activity_logs.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          description: true,
          createdAt: true,
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
  },

  async getUserLogs(userId: number, page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const where = {
      role: Role.User,
      userId,
    };

    const [count, rows] = await Promise.all([
      prisma.tb_activity_logs.count({ where }),
      prisma.tb_activity_logs.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          description: true,
          createdAt: true,
        },
      }),
    ]);

    return pagination.paginate({ count, rows });
  },
};
