/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `payment` table. All the data in the column will be lost.
  - Added the required column `aout` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frais_ins` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `juillet` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Payment_studentId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `Student_classId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `paymentDate`,
    ADD COLUMN `aout` ENUM('PAID', 'UNPAID', 'PENDING') NOT NULL,
    ADD COLUMN `frais_ins` DOUBLE NOT NULL,
    ADD COLUMN `juillet` ENUM('PAID', 'UNPAID', 'PENDING') NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
