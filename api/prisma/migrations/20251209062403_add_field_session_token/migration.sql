/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken]` on the table `tb_otp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionToken` to the `tb_otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_otp" ADD COLUMN     "sessionToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_otp_sessionToken_key" ON "tb_otp"("sessionToken");
