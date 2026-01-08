/*
  Warnings:

  - A unique constraint covering the columns `[orderCode]` on the table `tb_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_orders" ADD COLUMN     "orderCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_orders_orderCode_key" ON "tb_orders"("orderCode");
