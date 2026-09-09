-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "defectiveMonoInsta360Count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuedMonoInsta360Count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SalesBusiness" ADD COLUMN     "defectiveMonoInsta360Count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuedMonoInsta360Count" INTEGER NOT NULL DEFAULT 0;
