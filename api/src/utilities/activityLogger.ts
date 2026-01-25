import prisma from "../lib/prisma";
import { Request } from "express";
import { ActivityAction, Role } from "@prisma/client";
export async function logActivity({
  userId,
  role,
  action,
  description,
  req,
}: {
  userId: number;
  role: Role;
  action: ActivityAction;
  description: string;
  req?: Request;
}) {
  return prisma.tb_activity_logs.create({
    data: {
      userId,
      role,
      action,
      description,
      createdAt: new Date(),
    },
  });
}
