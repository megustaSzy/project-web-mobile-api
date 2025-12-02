/*
  Warnings:

  - You are about to drop the column `values` on the `tb_about` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_about" DROP COLUMN "values";

-- CreateTable
CREATE TABLE "tb_values" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_values_pkey" PRIMARY KEY ("id")
);
