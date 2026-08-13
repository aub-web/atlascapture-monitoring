-- AlterTable
ALTER TABLE "SalesUtilizationEntry" ADD COLUMN     "recordedHours" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UtilizationEntry" ADD COLUMN     "recordedHours" DOUBLE PRECISION NOT NULL DEFAULT 0;
