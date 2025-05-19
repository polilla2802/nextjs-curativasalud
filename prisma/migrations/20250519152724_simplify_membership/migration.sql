/*
  Warnings:

  - You are about to drop the column `documentId` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `documentUrl` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_documentId_fkey";

-- DropIndex
DROP INDEX "Membership_documentId_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "documentId";
ALTER TABLE "Membership" DROP COLUMN "type";
ALTER TABLE "Membership" ADD COLUMN     "documentUrl" STRING(1024) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "birthday";
ALTER TABLE "user" DROP COLUMN "city";

-- DropTable
DROP TABLE "Document";
