-- CreateTable
CREATE TABLE "tb_ourTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "tb_ourTeam_pkey" PRIMARY KEY ("id")
);
