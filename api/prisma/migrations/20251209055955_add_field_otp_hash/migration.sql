/*
  Warnings:

  - You are about to drop the column `otp` on the `tb_otp` table. All the data in the column will be lost.
  - Added the required column `otpHash` to the `tb_otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tb_otp_email_key";

-- AlterTable
ALTER TABLE "tb_otp" DROP COLUMN "otp",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpHash" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "tb_otp_email_idx" ON "tb_otp"("email");
