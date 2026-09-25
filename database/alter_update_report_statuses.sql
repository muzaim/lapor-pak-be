-- ============================================================
-- SQL Migration Script: Update Status Enum on reports & report_histories
-- Run this script in your MySQL database to alter tables
-- ============================================================

USE `lapor_pak`;

-- 1. Migrate existing data status values to new Indonesian status names
UPDATE `reports` SET `status` = 'DIAJUKAN' WHERE `status` = 'PENDING';
UPDATE `reports` SET `status` = 'DIPROSES' WHERE `status` = 'IN_REVIEW';
UPDATE `reports` SET `status` = 'SELESAI' WHERE `status` = 'RESOLVED';
UPDATE `reports` SET `status` = 'DITOLAK' WHERE `status` = 'REJECTED';

UPDATE `report_histories` SET `previous_status` = 'DIAJUKAN' WHERE `previous_status` = 'PENDING';
UPDATE `report_histories` SET `previous_status` = 'DIPROSES' WHERE `previous_status` = 'IN_REVIEW';
UPDATE `report_histories` SET `previous_status` = 'SELESAI' WHERE `previous_status` = 'RESOLVED';
UPDATE `report_histories` SET `previous_status` = 'DITOLAK' WHERE `previous_status` = 'REJECTED';

UPDATE `report_histories` SET `new_status` = 'DIAJUKAN' WHERE `new_status` = 'PENDING';
UPDATE `report_histories` SET `new_status` = 'DIPROSES' WHERE `new_status` = 'IN_REVIEW';
UPDATE `report_histories` SET `new_status` = 'SELESAI' WHERE `new_status` = 'RESOLVED';
UPDATE `report_histories` SET `new_status` = 'DITOLAK' WHERE `new_status` = 'REJECTED';

-- 2. Alter column ENUM definition on reports table
ALTER TABLE `reports` 
MODIFY COLUMN `status` ENUM('DIAJUKAN', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL DEFAULT 'DIAJUKAN';

-- 3. Alter column ENUM definition on report_histories table
ALTER TABLE `report_histories` 
MODIFY COLUMN `previous_status` ENUM('DIAJUKAN', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') DEFAULT NULL,
MODIFY COLUMN `new_status` ENUM('DIAJUKAN', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL;
