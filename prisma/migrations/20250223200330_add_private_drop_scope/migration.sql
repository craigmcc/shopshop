/*
  Warnings:

  - You are about to drop the column `scope` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "scope";
