import prisma from "../lib/prisma";
import { BannerData } from "../types/banner";
import { createError } from "../utilities/createError";

export const bannerService = {
  async getAllBanner() {
    return prisma.tb_banner.findMany({
      orderBy: {
        id: "asc",
      },
    });
  },

  async getByIdBanner(id: number) {
    const testimoni = await prisma.tb_testimoni.findUnique({
        where: {
            id
        }
    });

    if(!testimoni) throw createError("id tidak ditemukan", 404);

    return testimoni
  },


  async createBanner(data: BannerData) {
    return prisma.tb_banner.create({
      data: {
        number: data.number,
        header: data.header,
        name: data.name,
      },
    });
  },
  

  async editBanner(id: number, data: BannerData) {
    const banner = await prisma.tb_banner.findUnique({
      where: {
        id,
      },
    });

    if (!banner) throw createError("id tidak ditemukan", 404);

    return prisma.tb_banner.update({
      where: {
        id,
      },
      data: {
        number: data.number,
        header: data.header,
        name: data.name,
      },
    });
  },


  async deleteBanner(id: number) {
    const banner = await prisma.tb_banner.findUnique({
        where: {
            id  
        }
    });

    if(!banner) throw createError("id tidak ditemukan", 404);

    return prisma.tb_testimoni.delete({
        where: {
            id
        }
    })
  }
};
