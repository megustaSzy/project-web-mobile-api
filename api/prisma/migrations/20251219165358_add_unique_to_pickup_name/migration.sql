/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tb_pickup_locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_pickup_locations_name_key" ON "tb_pickup_locations"("name");
