-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "partnerAssociate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "recordingsCount" INTEGER NOT NULL,
    "expectedHours" REAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "whatWentWrong" TEXT,
    "whatNeedsImprovement" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckIn_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Business_category_idx" ON "Business"("category");

-- CreateIndex
CREATE INDEX "Business_partnerAssociate_idx" ON "Business"("partnerAssociate");

-- CreateIndex
CREATE INDEX "CheckIn_businessId_idx" ON "CheckIn"("businessId");

-- CreateIndex
CREATE INDEX "CheckIn_checkInDate_idx" ON "CheckIn"("checkInDate");
