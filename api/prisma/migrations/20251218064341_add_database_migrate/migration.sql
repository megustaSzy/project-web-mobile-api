/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `tb_orders` table. All the data in the column will be lost.
  - You are about to drop the column `attempts` on the `tb_otp` table. All the data in the column will be lost.
  - You are about to drop the column `otpHash` on the `tb_otp` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `tb_otp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `tb_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `otp` to the `tb_otp` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestimoniStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "tb_orders" DROP CONSTRAINT "tb_orders_scheduleId_fkey";

-- DropIndex
DROP INDEX "tb_orders_userId_scheduleId_key";

-- DropIndex
DROP INDEX "tb_otp_email_idx";

-- DropIndex
DROP INDEX "tb_otp_sessionToken_key";

-- AlterTable
ALTER TABLE "tb_destinations" ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "include" TEXT[],
ADD COLUMN     "ketentuan" TEXT[],
ADD COLUMN     "perhatian" TEXT[],
ADD COLUMN     "regionId" INTEGER;

-- AlterTable
ALTER TABLE "tb_orders" DROP COLUMN "scheduleId",
ADD COLUMN     "pickupLocationId" INTEGER,
ADD COLUMN     "pickupLocationName" TEXT,
ADD COLUMN     "returnTime" TEXT;

-- AlterTable
ALTER TABLE "tb_otp" DROP COLUMN "attempts",
DROP COLUMN "otpHash",
DROP COLUMN "sessionToken",
ADD COLUMN     "otp" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tb_ourTeam" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "tb_user" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "avatarPublicId" TEXT;

-- AlterTable
ALTER TABLE "tb_values" ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "tb_regions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_testimoni" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "profession" TEXT,
    "comment" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "approvalStatus" "TestimoniStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_testimoni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_banner" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_regions_name_key" ON "tb_regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_orders_userId_date_key" ON "tb_orders"("userId", "date");

-- AddForeignKey
ALTER TABLE "tb_destinations" ADD CONSTRAINT "tb_destinations_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "tb_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_orders" ADD CONSTRAINT "tb_orders_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "tb_pickup_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
