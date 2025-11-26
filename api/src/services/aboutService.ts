import prisma from "../lib/prisma";


export const aboutService = {

    async getAbout() {
        return prisma.tb_about.findFirst();
    },

    async getField(field: "history" | "vision" | "mission") {
        const about = await prisma.tb_about.findFirst({
            select: {
                [field]: true
            }
        })
    },

    

}