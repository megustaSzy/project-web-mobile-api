/*
  Warnings:

  - The `paymentMethod` column on the `tb_orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `tb_orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,scheduleId]` on the table `tb_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'expired');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('qris', 'bank_transfer', 'gopay', 'gopay_merchant', 'credit_card', 'ewallet');

-- AlterTable
ALTER TABLE "tb_orders" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "destinationPrice" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod",
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "tb_orders_userId_scheduleId_key" ON "tb_orders"("userId", "scheduleId");
