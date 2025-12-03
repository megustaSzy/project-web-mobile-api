/*
  Warnings:

  - A unique constraint covering the columns `[ticketCode]` on the table `tb_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticketCode` to the `tb_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_orders" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ticketCode" TEXT NOT NULL,
ADD COLUMN     "ticketUrl" TEXT;

-- AlterTable
ALTER TABLE "tb_values" ADD COLUMN     "header" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_orders_ticketCode_key" ON "tb_orders"("ticketCode");
