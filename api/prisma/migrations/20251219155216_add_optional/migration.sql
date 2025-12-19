-- DropForeignKey
ALTER TABLE "tb_orders" DROP CONSTRAINT "tb_orders_pickupLocationId_fkey";

-- AlterTable
ALTER TABLE "tb_orders" ALTER COLUMN "pickupLocationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_orders" ADD CONSTRAINT "tb_orders_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "tb_pickup_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
