-- CreateTable
CREATE TABLE "PartnerAssociate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerAssociate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerAssociate_name_key" ON "PartnerAssociate"("name");

-- Seed the roster that was previously hardcoded in src/lib/constants.ts, so
-- existing businesses' partnerAssociate values keep matching an entry here.
INSERT INTO "PartnerAssociate" ("id", "name") VALUES
  ('seed-partner-associate-1', 'Aubrey Tutor'),
  ('seed-partner-associate-2', 'Keeby Binas'),
  ('seed-partner-associate-3', 'Verly Reyes'),
  ('seed-partner-associate-4', 'Joaquin Tuason'),
  ('seed-partner-associate-5', 'Dan Palma');
