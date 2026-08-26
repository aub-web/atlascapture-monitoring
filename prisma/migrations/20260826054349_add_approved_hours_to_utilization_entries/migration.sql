-- AlterTable
ALTER TABLE "SalesUtilizationEntry" ADD COLUMN     "approvedHours" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UtilizationEntry" ADD COLUMN     "approvedHours" DOUBLE PRECISION NOT NULL DEFAULT 0;
