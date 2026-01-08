-- CreateTable
CREATE TABLE "tb_orders" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "tickets" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "destinationPrice" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_orders" ADD CONSTRAINT "tb_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_orders" ADD CONSTRAINT "tb_orders_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "tb_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
