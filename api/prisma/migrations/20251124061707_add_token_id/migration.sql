/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `tb_refreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tb_refreshToken_token_key";

-- AlterTable
ALTER TABLE "tb_refreshToken" ADD COLUMN     "tokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_refreshToken_tokenId_key" ON "tb_refreshToken"("tokenId");
