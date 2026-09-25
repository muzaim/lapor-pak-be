-- ============================================================
-- Database Schema for Lapor Pak API
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB
-- ============================================================

CREATE DATABASE IF NOT EXISTS `lapor_pak` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lapor_pak`;

-- Disable foreign key checks for clean drop & re-creation
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `village_office_info`;
DROP TABLE IF EXISTS `app_settings`;
DROP TABLE IF EXISTS `village_geographics`;
DROP TABLE IF EXISTS `village_vision_mission`;
DROP TABLE IF EXISTS `village_head`;
DROP TABLE IF EXISTS `village_profile`;
DROP TABLE IF EXISTS `report_histories`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Table Structure: `users`
-- ============================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `reports`
-- ============================================================
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_code` VARCHAR(50) UNIQUE DEFAULT NULL,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('DIAJUKAN', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL DEFAULT 'DIAJUKAN',
  `admin_response` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reports_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `report_images` (Multiple Report Attachments)
-- ============================================================
CREATE TABLE `report_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_report_images_reports` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `report_histories`
-- ============================================================
CREATE TABLE `report_histories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `previous_status` ENUM('DIAJUKAN', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') DEFAULT NULL,
  `new_status` ENUM('DIAJUKAN', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_histories_reports` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_histories_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `report_history_images` (Multiple Status Change Photos)
-- ============================================================
CREATE TABLE `report_history_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `history_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_history_images_histories` FOREIGN KEY (`history_id`) REFERENCES `report_histories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `village_profile` (Master Data Desa)
-- ============================================================
CREATE TABLE `village_profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `village_name` VARCHAR(255) NOT NULL,
  `head_of_village` VARCHAR(255) NOT NULL,
  `vision` TEXT NOT NULL,
  `mission` TEXT NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `banner_url` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `village_head` (Master Kepala Desa)
-- ============================================================
CREATE TABLE `village_head` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `period` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `village_vision_mission` (Master Visi Misi)
-- ============================================================
CREATE TABLE `village_vision_mission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vision` TEXT NOT NULL,
  `mission` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `village_geographics` (Master Letak Geografis)
-- ============================================================
CREATE TABLE `village_geographics` (
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

-- ============================================================
-- Table Structure: `app_settings` (Master App Settings)
-- ============================================================
CREATE TABLE `app_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `app_name` VARCHAR(255) NOT NULL,
  `village_name` VARCHAR(255) NOT NULL,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table Structure: `village_office_info` (Master Alamat & Operasional Kantor)
-- ============================================================
CREATE TABLE `village_office_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `office_address` TEXT NOT NULL,
  `operational_hours` TEXT NOT NULL,
  `operational_description` TEXT DEFAULT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Initial Seed Data
-- ============================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Pak Admin', 'admin@laporpak.com', '$2b$10$wn2IP2Hn/LU79/zRTaVuu.gsMyzulU4q7fhlGXCZhDJq4FZ1Mgb9.', 'ADMIN'),
(2, 'Budi Pengadu', 'budi@example.com', '$2b$10$EkaUFnBjCHC2OhDkJjqR4eIDVJM34sjMvqfhNvcvVP7WRYwyIZzIa', 'USER');

INSERT INTO `reports` (`id`, `user_id`, `title`, `description`, `category`, `location`, `image_url`, `status`, `admin_response`) VALUES
(1, 2, 'Lampu Jalan Mati', 'Lampu jalan di depan RT 02 mati sejak dua hari yang lalu.', 'INFRASTRUCTURE', 'Jl. Mawar No. 12', NULL, 'DIAJUKAN', NULL);

INSERT INTO `report_histories` (`id`, `report_id`, `user_id`, `previous_status`, `new_status`, `comment`, `image_url`) VALUES
(1, 1, 2, NULL, 'DIAJUKAN', 'Laporan dibuat oleh pengguna', NULL);

INSERT INTO `village_profile` (
  `id`, `village_name`, `head_of_village`, `vision`, `mission`, `address`, `phone`, `email`, `description`
) VALUES (
  1,
  'Desa Lapor Pak',
  'Bpk. H. Ahmad Sanusi',
  'Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.',
  '1. Meningkatkan pelayanan publik berbasis digital.\n2. Pembangunan infrastruktur desa yang merata.',
  'Jl. Raya Desa No. 1, Kecamatan Maju, Kabupaten Sejahtera',
  '0812-3456-7890',
  'kontak@desalaporpak.go.id',
  'Desa Lapor Pak adalah desa digital terdepan dalam pelayanan dan penanganan aspirasi serta pengaduan masyarakat.'
);

INSERT INTO `village_head` (`id`, `name`, `photo_url`, `period`, `description`) VALUES
(1, 'Bpk. H. Ahmad Sanusi', NULL, '2020 - 2026', 'Kepala Desa Lapor Pak periode 2020-2026 yang berdedikasi membangun pelayanan desa transparan.');

INSERT INTO `village_vision_mission` (`id`, `vision`, `mission`) VALUES
(1, 'Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.', '1. Meningkatkan pelayanan publik berbasis digital.\n2. Pembangunan infrastruktur desa yang merata.\n3. Mengembangkan potensi ekonomi dan UMKM warga desa.');

INSERT INTO `village_geographics` (
  `id`, `google_maps_url`, `border_north`, `border_south`, `border_east`, `border_west`, `area_size`, `average_altitude`, `total_dusun`, `topography`
) VALUES (
  1,
  'https://maps.google.com/maps?q=Kantor+Desa+Nglaban+Loceret+Nganjuk&t=&z=15&ie=UTF8&iwloc=&output=embed',
  'Desa Sukalama',
  'Kecamatan Selatan',
  'Sungai Citarum',
  'Perbukitan Barat',
  '14.5 km²',
  '650 mdpl',
  6,
  'Dataran Tinggi & Perbukitan'
);

INSERT INTO `app_settings` (`id`, `app_name`, `village_name`, `logo_url`) VALUES
(1, 'Lapor Pak Desa', 'Desa Sukamaju', NULL);

INSERT INTO `village_office_info` (
  `id`, `office_address`, `operational_hours`, `operational_description`, `phone`, `email`
) VALUES (
  1,
  'Jl. Raya Desa No. 01, Kecamatan Maju, Kabupaten Sejahtera 40123',
  'Senin - Jumat: 08.00 - 15.00 WIB',
  'Sabtu, Minggu dan Hari Libur Nasional Tutup. Untuk pelayanan darurat dapat menghubungi kontak WhatsApp kantor desa.',
  '0812-3456-7890',
  'kontak@desalaporpak.go.id'
);
