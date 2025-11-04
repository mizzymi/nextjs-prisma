/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CardId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Card` table. All the data in the column will be lost.
  - Added the required column `Id` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "CardId",
DROP COLUMN "id",
ADD COLUMN     "Id" TEXT NOT NULL,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("Id");
