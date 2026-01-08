-- AlterTable
ALTER TABLE "tb_orders" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "snapRedirectUrl" TEXT,
ADD COLUMN     "snapToken" TEXT,
ADD COLUMN     "transactionId" TEXT;
