-- ============================================================
-- ALTER TABLE Script for adding village_office_info table
-- Run this query to enable Office Contact & Operational Info Master Data
-- ============================================================

USE `lapor_pak`;

CREATE TABLE IF NOT EXISTS `village_office_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `office_address` TEXT NOT NULL,
  `operational_hours` TEXT NOT NULL,
  `operational_description` TEXT DEFAULT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `village_office_info` (
  `id`, `office_address`, `operational_hours`, `operational_description`, `phone`, `email`
) VALUES (
  1,
  'Jl. Raya Desa No. 01, Kecamatan Maju, Kabupaten Sejahtera 40123',
  'Senin - Jumat: 08.00 - 15.00 WIB',
  'Sabtu, Minggu dan Hari Libur Nasional Tutup. Untuk pelayanan darurat dapat menghubungi kontak WhatsApp kantor desa.',
  '0812-3456-7890',
  'kontak@desalaporpak.go.id'
) ON DUPLICATE KEY UPDATE `id`=`id`;
