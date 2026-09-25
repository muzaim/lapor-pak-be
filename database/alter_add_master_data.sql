-- ============================================================
-- ALTER TABLE Script for adding Master Data Modules
-- Modules: Kepala Desa, Visi Misi, Letak Geografis, App Settings
-- ============================================================

USE `lapor_pak`;

-- 1. Table for Kepala Desa
CREATE TABLE IF NOT EXISTS `village_head` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `period` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table for Visi Misi
CREATE TABLE IF NOT EXISTS `village_vision_mission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vision` TEXT NOT NULL,
  `mission` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table for Letak Geografis & Statistik Administrasi
CREATE TABLE IF NOT EXISTS `village_geographics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `google_maps_url` TEXT NOT NULL,
  `border_north` VARCHAR(255) NOT NULL,
  `border_south` VARCHAR(255) NOT NULL,
  `border_east` VARCHAR(255) NOT NULL,
  `border_west` VARCHAR(255) NOT NULL,
  `area_size` VARCHAR(100) NOT NULL,
  `average_altitude` VARCHAR(100) NOT NULL,
  `total_dusun` INT NOT NULL DEFAULT 0,
  `topography` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table for Master App Settings
CREATE TABLE IF NOT EXISTS `app_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `app_name` VARCHAR(255) NOT NULL,
  `village_name` VARCHAR(255) NOT NULL,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Initial Seed Data
-- ============================================================

INSERT INTO `village_head` (`id`, `name`, `photo_url`, `period`, `description`) VALUES
(1, 'Bpk. H. Ahmad Sanusi', NULL, '2020 - 2026', 'Kepala Desa Lapor Pak periode 2020-2026 yang berdedikasi membangun pelayanan desa transparan.')
ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `village_vision_mission` (`id`, `vision`, `mission`) VALUES
(1, 'Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.', '1. Meningkatkan pelayanan publik berbasis digital.\n2. Pembangunan infrastruktur desa yang merata.\n3. Mengembangkan potensi ekonomi dan UMKM warga desa.')
ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `village_geographics` (
  `id`, `google_maps_url`, `border_north`, `border_south`, `border_east`, `border_west`, `area_size`, `average_altitude`, `total_dusun`, `topography`
) VALUES (
  1,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.573117!3d-6.914744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x1460777f68d93cf4!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  'Desa Sukalama',
  'Kecamatan Selatan',
  'Sungai Citarum',
  'Perbukitan Barat',
  '14.5 km²',
  '650 mdpl',
  6,
  'Dataran Tinggi & Perbukitan'
) ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `app_settings` (`id`, `app_name`, `village_name`, `logo_url`) VALUES
(1, 'Lapor Pak Desa', 'Desa Sukamaju', NULL)
ON DUPLICATE KEY UPDATE `id`=`id`;
