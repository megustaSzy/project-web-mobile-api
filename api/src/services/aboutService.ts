import prisma from "../lib/prisma";


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

}