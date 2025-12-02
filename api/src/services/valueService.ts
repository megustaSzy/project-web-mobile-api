import prisma from "../lib/prisma";
import { ValueData } from "../types/value";
import { createError } from "../utilities/createError";
import { Pagination } from "../utilities/Pagination";

export const valueService = {

    async getAllValue(page: number, limit: number){
        const pagination = new Pagination(page, limit);

        const count = await prisma.tb_values.count();

        const rows = await prisma.tb_values.findMany({
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: {
                id: 'asc'
            }
        });

        return pagination.paginate({ count, rows })
    },


    async valueById(id: number) {
        const value = await prisma.tb_values.findUnique({
            where: {
                id
            }
        });

        if(!value) createError("id tidak ditemukan", 404);

        return value;
    },

    async createValue(data: ValueData) {
        return prisma.tb_values.create({
            data: {
                name: data.name
            }
        })
    },

    async editValue(id: number, data: ValueData) {
        const value = await prisma.tb_values.findUnique({
            where: {
                id
            }
        });

        if(!value) createError("id tidak ditemukan", 404);

        return prisma.tb_values.update({
            where: {
                id
            },
            data: {
                name: data.name
            }
        })
    },

    async deleteById(id: number) {
        const value = await prisma.tb_values.findUnique({
            where: {
                id
            }
        });

        if(!value) createError("id tidak ditemukan", 404);

        return prisma.tb_values.delete({
            where: {
                id
            }
        })
    }

}