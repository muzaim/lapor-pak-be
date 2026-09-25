-- ============================================================
-- SQL Migration Script: Add ticket_code column to reports table
-- Run this script in your MySQL database
-- ============================================================

USE `lapor_pak`;

-- 1. Add ticket_code column to reports table if not exists
ALTER TABLE `reports` ADD COLUMN `ticket_code` VARCHAR(50) UNIQUE DEFAULT NULL AFTER `id`;

-- 2. Populate ticket_code for existing records (e.g. LP000001, LP000002, etc.)
UPDATE `reports` SET `ticket_code` = CONCAT('LP', LPAD(id, 6, '0')) WHERE `ticket_code` IS NULL;
