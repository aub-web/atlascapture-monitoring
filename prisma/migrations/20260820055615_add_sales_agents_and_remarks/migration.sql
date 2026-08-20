-- AlterTable
ALTER TABLE "SalesUtilizationEntry" ADD COLUMN     "remarks" TEXT;

-- CreateTable
CREATE TABLE "SalesAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesAgent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesAgent_name_key" ON "SalesAgent"("name");

-- Seed the roster that was previously hardcoded in src/lib/constants.ts, so
-- existing sales businesses' salesAgent values keep matching an entry here.
INSERT INTO "SalesAgent" ("id", "name") VALUES
  ('seed-sales-agent-1', 'Vince Andrei Flores'),
  ('seed-sales-agent-2', 'Allan Bamba'),
  ('seed-sales-agent-3', 'Tristan Shayne Navidad'),
  ('seed-sales-agent-4', 'John Carlo Bernardino'),
  ('seed-sales-agent-5', 'James Clark Lumasac'),
  ('seed-sales-agent-6', 'Geramaica Dela Cruz'),
  ('seed-sales-agent-7', 'Jeremiah Crisostomo');
