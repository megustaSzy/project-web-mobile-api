import prisma from "../lib/prisma";

export const statService = {
  async getStats() {
    const totalUsers = await prisma.tb_user.count();
    const totalDestinations = await prisma.tb_destinations.count();
    const totalCategories = await prisma.tb_category.count();

    return {
      counts: {
        totalUsers,
        totalDestinations,
        totalCategories,
      },
      chartData: [
        { name: "Users", value: totalUsers },
        { name: "Destinations", value: totalDestinations },
        { name: "Categories", value: totalCategories },
      ],
    };
  },
};
