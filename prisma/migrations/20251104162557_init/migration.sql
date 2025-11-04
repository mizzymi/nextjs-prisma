/*
  Warnings:

  - Added the required column `CardId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "CardId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
