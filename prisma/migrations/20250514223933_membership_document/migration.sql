-- CreateTable
CREATE TABLE "Membership" (
    "id" INT8 NOT NULL,
    "type" STRING(255),
    "membershipUrl" STRING(1024) NOT NULL,
    "authCode" STRING(1024) NOT NULL,
    "documentId" INT8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "documentUrl" STRING(1024) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_documentId_key" ON "Membership"("documentId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
