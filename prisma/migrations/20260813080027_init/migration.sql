-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "partnerAssociate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
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

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UtilizationEntry" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UtilizationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesBusiness" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salesAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesUtilizationEntry" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesUtilizationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogEntry" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Business_category_idx" ON "Business"("category");

-- CreateIndex
CREATE INDEX "Business_partnerAssociate_idx" ON "Business"("partnerAssociate");

-- CreateIndex
CREATE INDEX "CheckIn_businessId_idx" ON "CheckIn"("businessId");

-- CreateIndex
CREATE INDEX "CheckIn_checkInDate_idx" ON "CheckIn"("checkInDate");

-- CreateIndex
CREATE INDEX "UtilizationEntry_businessId_idx" ON "UtilizationEntry"("businessId");

-- CreateIndex
CREATE INDEX "UtilizationEntry_date_idx" ON "UtilizationEntry"("date");

-- CreateIndex
CREATE INDEX "SalesBusiness_salesAgent_idx" ON "SalesBusiness"("salesAgent");

-- CreateIndex
CREATE INDEX "SalesUtilizationEntry_businessId_idx" ON "SalesUtilizationEntry"("businessId");

-- CreateIndex
CREATE INDEX "SalesUtilizationEntry_date_idx" ON "SalesUtilizationEntry"("date");

-- CreateIndex
CREATE INDEX "AuditLogEntry_createdAt_idx" ON "AuditLogEntry"("createdAt");

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UtilizationEntry" ADD CONSTRAINT "UtilizationEntry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesUtilizationEntry" ADD CONSTRAINT "SalesUtilizationEntry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "SalesBusiness"("id") ON DELETE CASCADE ON UPDATE CASCADE;
