-- MySQL dump 10.13  Distrib 9.1.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: lapor_pak
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_settings`
--

DROP TABLE IF EXISTS `app_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `village_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_settings`
--

LOCK TABLES `app_settings` WRITE;
/*!40000 ALTER TABLE `app_settings` DISABLE KEYS */;
INSERT INTO `app_settings` VALUES (1,'Lapor Pak','Desa Nglaban','/uploads/report-1790306007415-585140855.webp','2026-09-24 13:08:32','2026-09-25 03:13:27');
/*!40000 ALTER TABLE `app_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_histories`
--

DROP TABLE IF EXISTS `report_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `user_id` int NOT NULL,
  `previous_status` enum('DIAJUKAN','MENUNGGU','DIPROSES','SELESAI','DITOLAK') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` enum('DIAJUKAN','MENUNGGU','DIPROSES','SELESAI','DITOLAK') COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_histories_reports` (`report_id`),
  KEY `fk_histories_users` (`user_id`),
  CONSTRAINT `fk_histories_reports` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_histories_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_histories`
--

LOCK TABLES `report_histories` WRITE;
/*!40000 ALTER TABLE `report_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_history_images`
--

DROP TABLE IF EXISTS `report_history_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_history_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `history_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_history_images_histories` (`history_id`),
  CONSTRAINT `fk_history_images_histories` FOREIGN KEY (`history_id`) REFERENCES `report_histories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_history_images`
--

LOCK TABLES `report_history_images` WRITE;
/*!40000 ALTER TABLE `report_history_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_history_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_images`
--

DROP TABLE IF EXISTS `report_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_report_images_reports` (`report_id`),
  CONSTRAINT `fk_report_images_reports` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_images`
--

LOCK TABLES `report_images` WRITE;
/*!40000 ALTER TABLE `report_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DIAJUKAN','MENUNGGU','DIPROSES','SELESAI','DITOLAK') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DIAJUKAN',
  `admin_response` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_code` (`ticket_code`),
  KEY `fk_reports_users` (`user_id`),
  CONSTRAINT `fk_reports_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Pak Admin','admin@laporpak.com','$2b$10$Idbwuj5jKc2xgWxUUmgd2.cuDWP580ObZwGV7nDQEuiJ.UuiNzXsa','ADMIN','2026-09-24 05:13:26','2026-09-24 05:46:11'),(2,'Budi Pengadu','budi@example.com','$2b$10$Idbwuj5jKc2xgWxUUmgd2.cuDWP580ObZwGV7nDQEuiJ.UuiNzXsa','USER','2026-09-24 05:13:26','2026-09-24 05:46:11'),(3,'Syafri Surya','syafri@example.com','$2b$10$Idbwuj5jKc2xgWxUUmgd2.cuDWP580ObZwGV7nDQEuiJ.UuiNzXsa','USER','2026-09-24 05:22:32','2026-09-24 05:22:32'),(4,'ahmad','ahmad@example.com','$2b$10$hCkSHDatXsqy.cHidGFwceXgZIhL/EjdzWJPUezuXS.VmU2M5IK.y','USER','2026-09-24 06:32:56','2026-09-24 06:32:56'),(5,'Admin Check','admincheck@laporpak.id','$2b$10$uJr8d8b.66Fr49LOI8W9UudIXd4d/N3J0loMJ40iQl2GprYCutBQC','USER','2026-09-24 07:05:21','2026-09-24 07:05:21'),(6,'reza','reza@yopmail.com','$2b$10$0fpdswpj6CBV1D9Rx3CSJeRRnxB143UkB/HOJrGTJ0h2159jOK982','USER','2026-09-24 14:36:50','2026-09-25 03:09:31');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `village_geographics`
--

DROP TABLE IF EXISTS `village_geographics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `village_geographics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `google_maps_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `border_north` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `border_south` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `border_east` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `border_west` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area_size` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `average_altitude` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_dusun` int NOT NULL DEFAULT '0',
  `topography` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `village_geographics`
--

LOCK TABLES `village_geographics` WRITE;
/*!40000 ALTER TABLE `village_geographics` DISABLE KEYS */;
INSERT INTO `village_geographics` VALUES (1,'<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.545885219514!2d111.92256567602492!3d-7.624287492391303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e784b8d830c9177%3A0xc8f25c284ad671a6!2sKantor%20Desa%20Nglaban!5e0!3m2!1sid!2sid!4v1790304707849!5m2!1sid!2sid\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"strict-origin-when-cross-origin\"></iframe>','Desa Sukalama','Kecamatan Selatan','Sungai Citarum','Perbukitan Barat','14.5 km²','650 mdpl',6,'Dataran Tinggi & Perbukitan','2026-09-24 13:08:29','2026-09-25 02:52:11');
/*!40000 ALTER TABLE `village_geographics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `village_head`
--

DROP TABLE IF EXISTS `village_head`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `village_head` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `village_head`
--

LOCK TABLES `village_head` WRITE;
/*!40000 ALTER TABLE `village_head` DISABLE KEYS */;
INSERT INTO `village_head` VALUES (1,'Bpk. H. Ahmad Sanusi',NULL,'2020 - 2026','Kepala Desa Lapor Pak periode 2020-2026','2026-09-24 13:08:23','2026-09-25 02:58:58');
/*!40000 ALTER TABLE `village_head` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `village_office_info`
--

DROP TABLE IF EXISTS `village_office_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `village_office_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `office_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `operational_hours` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `operational_description` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `village_office_info`
--

LOCK TABLES `village_office_info` WRITE;
/*!40000 ALTER TABLE `village_office_info` DISABLE KEYS */;
INSERT INTO `village_office_info` VALUES (1,'Jl. Raya Desa No. 01, Kecamatan Maju, Kabupaten Sejahtera 40123','Senin - Jumat: 08.00 - 15.00 WIB','Sabtu, Minggu dan Hari Libur Nasional Tutup. Untuk pelayanan darurat dapat menghubungi kontak WhatsApp kantor desa.','0812-3456-7890','coba@desalaporpak.go.id','2026-09-24 14:26:59','2026-09-25 01:52:59');
/*!40000 ALTER TABLE `village_office_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `village_profile`
--

DROP TABLE IF EXISTS `village_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `village_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `village_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `head_of_village` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vision` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `mission` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `village_profile`
--

LOCK TABLES `village_profile` WRITE;
/*!40000 ALTER TABLE `village_profile` DISABLE KEYS */;
INSERT INTO `village_profile` VALUES (1,'Desa Lapor Pak','Bpk. H. Ahmad Sanusi','Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.','1. Meningkatkan pelayanan publik berbasis digital.\n2. Pembangunan infrastruktur desa yang merata.','Jl. Raya Desa No. 1, Kecamatan Maju, Kabupaten Sejahtera','0812-3456-7890','kontak@desalaporpak.go.id',NULL,NULL,'Desa Lapor Pak adalah desa digital terdepan dalam pelayanan dan penanganan aspirasi serta pengaduan masyarakat.','2026-09-24 05:55:14','2026-09-24 05:55:14');
/*!40000 ALTER TABLE `village_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `village_vision_mission`
--

DROP TABLE IF EXISTS `village_vision_mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `village_vision_mission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vision` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `mission` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `village_vision_mission`
--

LOCK TABLES `village_vision_mission` WRITE;
/*!40000 ALTER TABLE `village_vision_mission` DISABLE KEYS */;
INSERT INTO `village_vision_mission` VALUES (1,'Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.d','1. Meningkatkan pelayanan publik berbasis digital.\n2. Pembangunan infrastruktur desa yang merata.\n3. Mengembangkan potensi ekonomi dan UMKM warga desa.','2026-09-24 13:08:26','2026-09-25 02:58:48');
/*!40000 ALTER TABLE `village_vision_mission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'lapor_pak'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-25 10:20:59
