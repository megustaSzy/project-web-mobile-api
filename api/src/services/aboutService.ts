import prisma from "../lib/prisma";
import { AboutData } from "../types/about";
import { createError } from "../utilities/createError";


export const aboutService = {

    async getAbout() {
        return prisma.tb_about.findFirst();
    },

    async getField(field: "history" | "vision" | "mission") {
        const about = await prisma.tb_about.findFirst({
            select: {
                [field]: true
            }
        });

        return about ? about[field]: null
    },

    async createAbout(data: AboutData) {
        return prisma.tb_about.create({
            data
        })
    },

    async updateAbout (id: number, data: AboutData) {
        const existing = await prisma.tb_about.findUnique({
            where: {
                id
            }
        });

        if(!existing) createError("id tidak ditemukan", 404);

        return prisma.tb_about.update({
            where: {
                id
            },
            data
        })
    },

    async deleteAbout(id: number) {
        const existing = await prisma.tb_about.findUnique({
            where: {
                id
            }
        });

        if(!existing) createError("id tidak ditemukan", 404);

        return prisma.tb_about.delete({
            where: {
                id
            }
        })
    }

}