import prisma from "../lib/prisma";
import { CreateBannerDTO, UpdateBannerDTO } from "../schemas/bannerSchema";
import { createError } from "../utilities/createError";

export const bannerService = {
  async getAllBanner() {
    return prisma.tb_banner.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        header: true,
        number: true,
        imageUrl: true,
      },
    });
  },

  async getByIdBanner(id: number) {
    const banner = await prisma.tb_banner.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        header: true,
        number: true,
        imageUrl: true,
        imagePublicId: true,
      },
    });

    if (!banner) throw createError("id tidak ditemukan", 404);

    return banner;
  },

  async createBanner(data: CreateBannerDTO) {
    return prisma.tb_banner.create({
      data: {
        number: data.number,
        header: data.header,
        name: data.name,
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
      },
    });
  },

  async editBanner(id: number, data: UpdateBannerDTO) {
    const banner = await prisma.tb_banner.findUnique({ where: { id } });
    if (!banner) throw createError("id tidak ditemukan", 404);

    return prisma.tb_banner.update({
      where: { id },
      data: {
        ...(data.number && { number: data.number }),
        ...(data.header && { header: data.header }),
        ...(data.name && { name: data.name }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
      },
    });
  },
  async deleteBanner(id: number) {
    const banner = await prisma.tb_banner.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!banner) throw createError("id tidak ditemukan", 404);

    return prisma.tb_banner.delete({
      where: {
        id,
      },
    });
  },
};
