/*
  Warnings:

  - You are about to drop the column `inviteCode` on the `lists` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "lists_inviteCode_key";

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "inviteCode";
