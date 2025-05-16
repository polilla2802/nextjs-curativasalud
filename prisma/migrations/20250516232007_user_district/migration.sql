/*
  Warnings:

  - Added the required column `district` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "district" STRING(255) NOT NULL;
