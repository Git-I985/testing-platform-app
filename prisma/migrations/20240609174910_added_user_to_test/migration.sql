-- CreateTable
CREATE TABLE `_TestToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TestToUser_AB_unique`(`A`, `B`),
    INDEX `_TestToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TestToUser` ADD CONSTRAINT `_TestToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TestToUser` ADD CONSTRAINT `_TestToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
