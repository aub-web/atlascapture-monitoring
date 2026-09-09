-- CreateTable
CREATE TABLE "SalesCheckIn" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "recordingsCount" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "stopTime" TEXT NOT NULL,
    "expectedHours" DOUBLE PRECISION NOT NULL,
    "deviceType" TEXT NOT NULL,
    "whatWentWrong" TEXT,
    "whatNeedsImprovement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalesCheckIn_businessId_idx" ON "SalesCheckIn"("businessId");

-- CreateIndex
CREATE INDEX "SalesCheckIn_checkInDate_idx" ON "SalesCheckIn"("checkInDate");

-- AddForeignKey
ALTER TABLE "SalesCheckIn" ADD CONSTRAINT "SalesCheckIn_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "SalesBusiness"("id") ON DELETE CASCADE ON UPDATE CASCADE;
