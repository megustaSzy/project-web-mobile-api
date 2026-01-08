-- CreateTable
CREATE TABLE "tb_schedules" (
    "id" SERIAL NOT NULL,
    "pickupLocationId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_schedules" ADD CONSTRAINT "tb_schedules_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "tb_pickup_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_schedules" ADD CONSTRAINT "tb_schedules_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "tb_destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
