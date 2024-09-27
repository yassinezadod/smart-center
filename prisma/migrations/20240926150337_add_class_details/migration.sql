/*
  Warnings:

  - You are about to drop the column `niveau` on the `class` table. All the data in the column will be lost.
  - Added the required column `group` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niveauClasse` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niveauScolaire` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Payment_studentId_fkey` ON `payment`;

-- DropIndex
DROP INDEX `Student_classId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `class` DROP COLUMN `niveau`,
    ADD COLUMN `group` VARCHAR(191) NOT NULL,
    ADD COLUMN `niveauClasse` VARCHAR(191) NOT NULL,
    ADD COLUMN `niveauScolaire` ENUM('Primaire', 'College', 'Lycee', 'Formation') NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
