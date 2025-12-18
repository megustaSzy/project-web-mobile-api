import prisma from "../lib/prisma";
import { CreateTeamDTO, UpdateTeamDTO } from "../schemas/teamSchema";
import { createError } from "../utilities/createError";

export const teamService = {

    async getTeam() {
        return prisma.tb_ourTeam.findMany({
            orderBy: {
                id: 'desc'
            }
        });
    },

    async getTeamById(id: number) {
        const team = await prisma.tb_ourTeam.findUnique({
            where: {
                id
            }
        });

        if(!team) throw createError("id tidak ditemukan", 404);

        return team;
    },

    async createTeam(data: CreateTeamDTO) {
        return prisma.tb_ourTeam.create({
            data
        })
    },

    async editTeam(id: number, data: UpdateTeamDTO) {
        const team = await prisma.tb_ourTeam.findUnique({
            where: {
                id
            }
        });

        if(!team) throw createError("id tidak ditemukan", 404);

        return prisma.tb_ourTeam.update({
            where: {
                id
            },
            data
        });
    },

    async deleteIdTeam(id: number) {
        const team = await prisma.tb_ourTeam.findUnique({
            where: {
                id
            },
        });

        if(!team) throw createError("id tidak ditemukan", 404);

        return prisma.tb_ourTeam.delete({
            where: {
                id
            }
        })
    }

}