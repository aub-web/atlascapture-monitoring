-- CreateTable
CREATE TABLE "UtilizationEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UtilizationEntry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesBusiness" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "salesAgent" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SalesUtilizationEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SalesUtilizationEntry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "SalesBusiness" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
