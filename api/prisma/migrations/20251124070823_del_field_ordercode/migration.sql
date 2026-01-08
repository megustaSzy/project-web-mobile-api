/*
  Warnings:

  - You are about to drop the column `orderCode` on the `tb_orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tb_orders_orderCode_key";

-- AlterTable
ALTER TABLE "tb_orders" DROP COLUMN "orderCode";
