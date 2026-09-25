-- ============================================================
-- SQL Migration Script: Add support for Multiple Images
-- Run this script in your MySQL database
-- ============================================================

USE `lapor_pak`;

-- 1. Create report_images table for multiple report attachments
CREATE TABLE IF NOT EXISTS `report_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_report_images_reports` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create report_history_images table for multiple status change photos
CREATE TABLE IF NOT EXISTS `report_history_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `history_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_history_images_histories` FOREIGN KEY (`history_id`) REFERENCES `report_histories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Migrate existing single image_url values to new child tables
INSERT INTO `report_images` (`report_id`, `image_url`)
SELECT `id`, `image_url` FROM `reports` 
WHERE `image_url` IS NOT NULL AND `image_url` != '' AND `id` NOT IN (SELECT `report_id` FROM `report_images`);

INSERT INTO `report_history_images` (`history_id`, `image_url`)
SELECT `id`, `image_url` FROM `report_histories` 
WHERE `image_url` IS NOT NULL AND `image_url` != '' AND `id` NOT IN (SELECT `history_id` FROM `report_history_images`);
