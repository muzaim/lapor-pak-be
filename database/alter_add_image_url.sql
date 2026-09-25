-- ============================================================
-- ALTER TABLE Script for adding image_url to reports table
-- Run this query if you already imported the previous database
-- ============================================================

USE `lapor_pak`;

ALTER TABLE `reports` 
ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL AFTER `location`;
