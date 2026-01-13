import prisma from "../lib/prisma";

export const statService = {
  async getStats() {
    const [
      totalUsers,
      totalDestinations,
      totalCategories,
      totalRegions,
      totalOrders,
    ] = await Promise.all([
      prisma.tb_user.count(),
      prisma.tb_destinations.count(),
      prisma.tb_category.count(),
      prisma.tb_regions.count(),
      prisma.tb_orders.count(),
    ]);

    return {
      counts: {
        totalUsers,
        totalDestinations,
        totalCategories,
        totalRegions,
        totalOrders,
      },
      chartData: [
        { name: "Users", value: totalUsers },
        { name: "Destinations", value: totalDestinations },
        { name: "Categories", value: totalCategories },
        { name: "Regions", value: totalRegions },
        { name: "Orders", value: totalOrders },
      ],
    };
  },
};
