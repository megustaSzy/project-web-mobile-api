-- CreateTable
CREATE TABLE "tb_pickup_locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_pickup_locations_pkey" PRIMARY KEY ("id")
);
