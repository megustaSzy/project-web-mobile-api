/*
  Warnings:

  - You are about to drop the column `categroyId` on the `tb_destinations` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `tb_destinations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_destinations" DROP CONSTRAINT "tb_destinations_categroyId_fkey";

-- AlterTable
ALTER TABLE "tb_destinations" DROP COLUMN "categroyId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_destinations" ADD CONSTRAINT "tb_destinations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tb_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
