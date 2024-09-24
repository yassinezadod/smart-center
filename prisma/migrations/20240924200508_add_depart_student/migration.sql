/*
  Warnings:

  - Added the required column `depart` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Payment_studentId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `Student_classId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `depart` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
