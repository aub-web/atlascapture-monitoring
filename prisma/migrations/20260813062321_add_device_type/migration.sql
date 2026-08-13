/*
  Warnings:

  - Added the required column `deviceType` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "recordingsCount" INTEGER NOT NULL,
    "expectedHours" REAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "whatWentWrong" TEXT,
    "whatNeedsImprovement" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckIn_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckIn" ("businessId", "checkInDate", "createdAt", "expectedHours", "id", "recordingsCount", "startTime", "whatNeedsImprovement", "whatWentWrong") SELECT "businessId", "checkInDate", "createdAt", "expectedHours", "id", "recordingsCount", "startTime", "whatNeedsImprovement", "whatWentWrong" FROM "CheckIn";
DROP TABLE "CheckIn";
ALTER TABLE "new_CheckIn" RENAME TO "CheckIn";
CREATE INDEX "CheckIn_businessId_idx" ON "CheckIn"("businessId");
CREATE INDEX "CheckIn_checkInDate_idx" ON "CheckIn"("checkInDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
