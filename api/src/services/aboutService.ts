import { PrivateResultType } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";
import { AboutData } from "../types/about";
import { createError } from "../utilities/createError";


export const aboutService = {

    async getAbout(includeCoreValues = false) {
        return prisma.tb_about.findFirst({
            include: {
                coreValues: includeCoreValues
            }
        })
    },

    async gitHistory() {
        const about = await prisma.tb_about.findFirst();
        return about?.history ?? null;
    },

    async getVision() {
        const about = await prisma.tb_about.findFirst();
        return about?.vision ?? null;
    },

    async getMission() {
        const about = await prisma.tb_about.findFirst();
        return about?.mission ?? null;
    },

    // async createAbout (id: number, data: AboutData) {
    //     const existing = await prisma.tb_about.findFirst({
    //         where: {
    //             id
    //         }
    //     });

    //     if(!existing) throw new Error("about tidak ditemukan");

    //     return prisma.tb_about.update({
    //         where: {
    //             id
    //         },
    //         data
    //     });
    // },

    // async updateAbout(id: number, data: AboutData) {
    //     const existing = await prisma.tb_about.findFirst({
    //         where: {
    //             id
    //         }
    //     });

    //     if(!existing) createError("id tidak ditemukan", 404);

    //     return prisma.tb_about.update({
    //         where: {
    //             id
    //         },
    //         data
    //     })
    // }

}