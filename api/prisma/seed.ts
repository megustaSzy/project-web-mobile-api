import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123@", 10);

  await prisma.tb_user.upsert({
    where: {
      email: "himawand656@gmail.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "himawand656@gmail.com",
      password: hashedPassword,
      notelp: "08572772",
      role: "Admin",
    },
  });

  console.log("Admin user seeded");

















  

  const category = ["Air Terjun", "Bukit", "Pantai", "Pulau", "Gunung"];

  for (const name of category) {
    await prisma.tb_category.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  console.log("Category seed");

  const pickup = [
    "Terminal Rajabasa",
    "Terminal Kemiling",
    "Stasiun Tanjung Karang",
  ];

  for (const name of pickup) {
    await prisma.tb_pickup_locations.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  console.log("Pickup seed");
}

main()
  .then(() => console.log("seeding done"))
  .catch((e) => {
    console.error("seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
