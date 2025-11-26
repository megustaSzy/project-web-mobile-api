/*
  Warnings:

  - You are about to drop the `tb_core_value` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_core_value" DROP CONSTRAINT "tb_core_value_aboutId_fkey";

-- DropTable
DROP TABLE "tb_core_value";
