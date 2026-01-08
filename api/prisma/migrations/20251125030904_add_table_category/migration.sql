/*
  Warnings:

  - You are about to drop the column `category` on the `tb_destinations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_destinations" DROP COLUMN "category",
ADD COLUMN     "categroyId" INTEGER;

-- CreateTable
CREATE TABLE "tb_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_destinations" ADD CONSTRAINT "tb_destinations_categroyId_fkey" FOREIGN KEY ("categroyId") REFERENCES "tb_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
