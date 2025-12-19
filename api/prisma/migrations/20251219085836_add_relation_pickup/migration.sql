/*
  Warnings:

  - You are about to drop the column `time` on the `tb_orders` table. All the data in the column will be lost.
  - You are about to alter the column `totalPrice` on the `tb_orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `destinationPrice` on the `tb_orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `tb_schedules` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departureTime` to the `tb_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationId` to the `tb_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLocationId` to the `tb_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLocationName` to the `tb_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_schedules" DROP CONSTRAINT "tb_schedules_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "tb_schedules" DROP CONSTRAINT "tb_schedules_pickupLocationId_fkey";

-- AlterTable
ALTER TABLE "tb_orders" DROP COLUMN "time",
ADD COLUMN     "departureTime" TEXT NOT NULL,
ADD COLUMN     "destinationId" INTEGER NOT NULL,
ADD COLUMN     "pickupLocationId" INTEGER NOT NULL,
ADD COLUMN     "pickupLocationName" TEXT NOT NULL,
ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "destinationPrice" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "tb_schedules";

-- CreateIndex
CREATE INDEX "tb_orders_userId_idx" ON "tb_orders"("userId");

-- CreateIndex
CREATE INDEX "tb_orders_destinationId_idx" ON "tb_orders"("destinationId");

-- CreateIndex
CREATE INDEX "tb_orders_paymentStatus_idx" ON "tb_orders"("paymentStatus");

-- AddForeignKey
ALTER TABLE "tb_orders" ADD CONSTRAINT "tb_orders_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "tb_destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_orders" ADD CONSTRAINT "tb_orders_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "tb_pickup_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
