/*
  Warnings:

  - The values [gopay_merchant,ewallet] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `pickupLocationId` on the `tb_orders` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLocationName` on the `tb_orders` table. All the data in the column will be lost.
  - You are about to drop the column `ticketUrl` on the `tb_orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentOrderId]` on the table `tb_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentOrderId` to the `tb_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `tb_orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `tb_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('qris', 'bank_transfer', 'gopay', 'credit_card');
ALTER TABLE "tb_orders" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "tb_orders" DROP CONSTRAINT "tb_orders_pickupLocationId_fkey";

-- DropIndex
DROP INDEX "tb_orders_userId_date_key";

-- AlterTable
ALTER TABLE "tb_orders" DROP COLUMN "pickupLocationId",
DROP COLUMN "pickupLocationName",
DROP COLUMN "ticketUrl",
ADD COLUMN     "paymentOrderId" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_orders_paymentOrderId_key" ON "tb_orders"("paymentOrderId");
