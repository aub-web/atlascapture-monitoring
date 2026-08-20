-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "SalesBusiness" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Business_status_idx" ON "Business"("status");

-- CreateIndex
CREATE INDEX "SalesBusiness_status_idx" ON "SalesBusiness"("status");
