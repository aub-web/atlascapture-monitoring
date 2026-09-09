-- CreateTable
CREATE TABLE "DeviceCountSnapshot" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "issuedCount" INTEGER NOT NULL,
    "defectiveCount" INTEGER NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceCountSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesDeviceCountSnapshot" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "issuedCount" INTEGER NOT NULL,
    "defectiveCount" INTEGER NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesDeviceCountSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeviceCountSnapshot_businessId_deviceType_effectiveAt_idx" ON "DeviceCountSnapshot"("businessId", "deviceType", "effectiveAt");

-- CreateIndex
CREATE INDEX "SalesDeviceCountSnapshot_businessId_deviceType_effectiveAt_idx" ON "SalesDeviceCountSnapshot"("businessId", "deviceType", "effectiveAt");

-- AddForeignKey
ALTER TABLE "DeviceCountSnapshot" ADD CONSTRAINT "DeviceCountSnapshot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDeviceCountSnapshot" ADD CONSTRAINT "SalesDeviceCountSnapshot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "SalesBusiness"("id") ON DELETE CASCADE ON UPDATE CASCADE;
