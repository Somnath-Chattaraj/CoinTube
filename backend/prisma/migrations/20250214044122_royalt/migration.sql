-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "royaltyFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscribers" INTEGER;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "royaltReceived" DOUBLE PRECISION NOT NULL DEFAULT 0;
