-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "defectiveMonoCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defectiveMulticamCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuedMonoCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuedMulticamCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SalesBusiness" ADD COLUMN     "defectiveMonoCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defectiveMulticamCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuedMonoCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuedMulticamCount" INTEGER NOT NULL DEFAULT 0;
