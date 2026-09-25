-- ============================================================
-- ALTER TABLE Script for adding image_url to report_histories
-- Run this query to enable optional photo attachments on status updates
-- ============================================================

USE `lapor_pak`;

ALTER TABLE `report_histories` 
ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL AFTER `comment`;
