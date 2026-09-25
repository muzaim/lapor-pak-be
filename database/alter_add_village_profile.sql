-- ============================================================
-- ALTER TABLE Script for adding village_profile table
-- Run this query to enable Master Data Desa
-- ============================================================

USE `lapor_pak`;

CREATE TABLE IF NOT EXISTS `village_profile` (
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

-- Initial default master data for village
INSERT INTO `village_profile` (
  `id`, `village_name`, `head_of_village`, `vision`, `mission`, `address`, `phone`, `email`, `description`
) VALUES (
  1,
  'Desa Lapor Pak',
  'Bpk. H. Ahmad Sanusi',
  'Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.',
  '1. Meningkatkan pelayanan publik berbasis digital.\n2. Pembangunan infrastruktur desa yang merata.\n3. Mengembangkan potensi ekonomi dan UMKM warga desa.',
  'Jl. Raya Desa No. 1, Kecamatan Maju, Kabupaten Sejahtera',
  '0812-3456-7890',
  'kontak@desalaporpak.go.id',
  'Desa Lapor Pak adalah desa digital terdepan dalam pelayanan dan penanganan aspirasi serta pengaduan masyarakat.'
) ON DUPLICATE KEY UPDATE `id`=`id`;
