import prisma from "../lib/prisma";
import { CreateAboutDTO, UpdateAboutDTO } from "../schemas/aboutSchema";
import { createError } from "../utilities/createError";


export const aboutService = {

    async getAbout() {
        return prisma.tb_about.findFirst();
    },
    
    async createAbout(data: CreateAboutDTO) {
        return prisma.tb_about.create({
            data
        })
    },

    async updateAbout (id: number, data: UpdateAboutDTO) {
        const existing = await prisma.tb_about.findUnique({
            where: {
                id
            }
        });

        if(!existing) throw createError("id tidak ditemukan", 404);

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