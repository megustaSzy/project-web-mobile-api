-- CreateTable
CREATE TABLE "tb_about" (
    "id" SERIAL NOT NULL,
    "history" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_about_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_core_value" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "tb_core_value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_core_value" ADD CONSTRAINT "tb_core_value_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "tb_about"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
