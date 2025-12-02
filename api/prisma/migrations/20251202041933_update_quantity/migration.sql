/*
  Warnings:

  - You are about to drop the column `tickets` on the `tb_orders` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `tb_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_orders" DROP COLUMN "tickets",
ADD COLUMN     "quantity" INTEGER NOT NULL;
