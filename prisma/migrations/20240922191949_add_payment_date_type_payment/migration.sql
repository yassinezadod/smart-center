-- DropIndex
DROP INDEX `Payment_studentId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `Student_classId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `payment` ALTER COLUMN `paymentDate` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
