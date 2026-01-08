import prisma from "../lib/prisma";

export const statService = {
  async getStats() {
    const [totalUsers, totalDestinations, totalCategories] = await Promise.all([
      prisma.tb_user.count(),
      prisma.tb_destinations.count(),
      prisma.tb_category.count(),
    ]);

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
