/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Card` table. All the data in the column will be lost.
  - Added the required column `id` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("deckId", "id");
