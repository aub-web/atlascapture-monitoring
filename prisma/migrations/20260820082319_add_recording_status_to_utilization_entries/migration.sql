-- AlterTable
ALTER TABLE "SalesUtilizationEntry" ADD COLUMN     "recordingStatus" TEXT NOT NULL DEFAULT 'ACTIVELY_RECORDING';

-- AlterTable
ALTER TABLE "UtilizationEntry" ADD COLUMN     "recordingStatus" TEXT NOT NULL DEFAULT 'ACTIVELY_RECORDING';
