/*
  Warnings:

  - Added the required column `results` to the `TestCompletion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testId` to the `TestCompletion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestCompletion` ADD COLUMN `results` VARCHAR(191) NOT NULL,
    ADD COLUMN `testId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TestCompletion` ADD CONSTRAINT `TestCompletion_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
