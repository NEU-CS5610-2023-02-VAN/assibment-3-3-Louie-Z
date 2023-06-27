/*
  Warnings:

  - Added the required column `popularity` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `track` ADD COLUMN `popularity` INTEGER NOT NULL;
