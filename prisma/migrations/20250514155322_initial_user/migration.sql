-- CreateTable
CREATE TABLE "user" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "memberId" INT8 NOT NULL,
    "name" STRING(255) NOT NULL,
    "email" STRING(255),
    "birthday" TIMESTAMP(3),
    "state" STRING(255) NOT NULL,
    "city" STRING(255),
    "supabaseUid" STRING(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_memberId_key" ON "user"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "user_supabaseUid_key" ON "user"("supabaseUid");
