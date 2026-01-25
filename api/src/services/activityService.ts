// services/activityService.ts
import prisma from "../lib/prisma";
import { Pagination } from "../utilities/Pagination";
import { $Enums } from "@prisma/client";

export const activityService = {
  async getAdminLogs(page: number, limit: number) {
    const pagination = new Pagination(page, limit);

    const where = {
      role: $Enums.Role.Admin,
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
      role: $Enums.Role.User,
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
