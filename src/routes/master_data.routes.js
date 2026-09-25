const express = require("express");
const router = express.Router();
const masterDataController = require("../controllers/master_data.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

/**
 * @swagger
 * tags:
 *   name: Master Data
 *   description: API Master Data Desa (Kepala Desa, Visi Misi, Geografis & Statistik, App Settings, Informasi Kantor & Kontak)
 */

/**
 * @swagger
 * /api/master/all:
 *   get:
 *     summary: Mendapatkan seluruh Master Data Desa sekaligus (Kepala Desa, Visi Misi, Geografis, App Settings, Informasi Kantor)
 *     tags: [Master Data]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil seluruh master data
 */
router.get("/all", asyncHandler(masterDataController.getAllMasterData));

// ============================================================
// 1. KEPALA DESA ROUTES
// ============================================================

/**
 * @swagger
 * /api/master/village-head:
 *   get:
 *     summary: Mendapatkan data Kepala Desa (Nama, Foto, Masa Jabatan, Desc)
 *     tags: [Master Data]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Kepala Desa
 */
router.get("/village-head", asyncHandler(masterDataController.getVillageHead));

/**
 * @swagger
 * /api/master/village-head:
 *   put:
 *     summary: Memperbarui data Kepala Desa (Khusus Admin)
 *     tags: [Master Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bpk. H. Ahmad Sanusi
 *               period:
 *                 type: string
 *                 example: 2020 - 2026
 *               description:
 *                 type: string
 *                 example: Kepala Desa Lapor Pak periode 2020-2026.
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Foto Kepala Desa (jpg, png, webp)
 *     responses:
 *       200:
 *         description: Data Kepala Desa berhasil diperbarui
 */
router.put(
  "/village-head",
  authenticateToken,
  requireRole("ADMIN"),
  upload.single("photo"),
  asyncHandler(masterDataController.updateVillageHead)
);

// ============================================================
// 2. VISI MISI ROUTES
// ============================================================

/**
 * @swagger
 * /api/master/vision-mission:
 *   get:
 *     summary: Mendapatkan data Visi Misi Desa
 *     tags: [Master Data]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Visi Misi
 */
router.get("/vision-mission", asyncHandler(masterDataController.getVisionMission));

/**
 * @swagger
 * /api/master/vision-mission:
 *   put:
 *     summary: Memperbarui data Visi Misi Desa (Khusus Admin)
 *     tags: [Master Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vision
 *               - mission
 *             properties:
 *               vision:
 *                 type: string
 *                 example: Terwujudnya Desa yang Maju, Sejahtera, Transparan, dan Berdaya Saing.
 *               mission:
 *                 type: string
 *                 example: 1. Meningkatkan pelayanan publik berbasis digital. 2. Pembangunan infrastruktur merata.
 *     responses:
 *       200:
 *         description: Data Visi Misi berhasil diperbarui
 */
router.put(
  "/vision-mission",
  authenticateToken,
  requireRole("ADMIN"),
  asyncHandler(masterDataController.updateVisionMission)
);

// ============================================================
// 3. LETAK GEOGRAFIS & STATISTIK ADMINISTRASI ROUTES
// ============================================================

/**
 * @swagger
 * /api/master/geographics:
 *   get:
 *     summary: Mendapatkan data Letak Geografis & Statistik Administrasi Desa
 *     tags: [Master Data]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Letak Geografis
 */
router.get("/geographics", asyncHandler(masterDataController.getGeographics));

/**
 * @swagger
 * /api/master/geographics:
 *   put:
 *     summary: Memperbarui data Letak Geografis & Statistik Administrasi (Khusus Admin)
 *     tags: [Master Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               google_maps_url:
 *                 type: string
 *                 example: https://www.google.com/maps/embed?pb=...
 *               border_north:
 *                 type: string
 *                 example: Desa Sukalama
 *               border_south:
 *                 type: string
 *                 example: Kecamatan Selatan
 *               border_east:
 *                 type: string
 *                 example: Sungai Citarum
 *               border_west:
 *                 type: string
 *                 example: Perbukitan Barat
 *               area_size:
 *                 type: string
 *                 example: 14.5 km²
 *               average_altitude:
 *                 type: string
 *                 example: 650 mdpl
 *               total_dusun:
 *                 type: integer
 *                 example: 6
 *               topography:
 *                 type: string
 *                 example: Dataran Tinggi & Perbukitan
 *     responses:
 *       200:
 *         description: Data Letak Geografis berhasil diperbarui
 */
router.put(
  "/geographics",
  authenticateToken,
  requireRole("ADMIN"),
  asyncHandler(masterDataController.updateGeographics)
);

// ============================================================
// 4. MASTER APP SETTINGS ROUTES
// ============================================================

/**
 * @swagger
 * /api/master/app-settings:
 *   get:
 *     summary: Mendapatkan data Setting Aplikasi (Logo, Nama App, Nama Desa)
 *     tags: [Master Data]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data App Settings
 */
router.get("/app-settings", asyncHandler(masterDataController.getAppSettings));

/**
 * @swagger
 * /api/master/app-settings:
 *   put:
 *     summary: Memperbarui data Setting Aplikasi (Khusus Admin)
 *     tags: [Master Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               app_name:
 *                 type: string
 *                 example: Lapor Pak Desa
 *               village_name:
 *                 type: string
 *                 example: Desa Sukamaju
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: File Logo Aplikasi (jpg, png, webp)
 *     responses:
 *       200:
 *         description: Data App Settings berhasil diperbarui
 */
router.put(
  "/app-settings",
  authenticateToken,
  requireRole("ADMIN"),
  upload.single("logo"),
  asyncHandler(masterDataController.updateAppSettings)
);

// ============================================================
// 5. INFORMASI KANTOR & KONTAK DESA ROUTES
// ============================================================

/**
 * @swagger
 * /api/master/office-info:
 *   get:
 *     summary: Mendapatkan data Alamat Kantor, Jam Operasional, No HP & Email Desa
 *     tags: [Master Data]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Informasi Kantor & Kontak Desa
 */
router.get("/office-info", asyncHandler(masterDataController.getOfficeInfo));

/**
 * @swagger
 * /api/master/office-info:
 *   put:
 *     summary: Memperbarui data Informasi Kantor & Kontak Desa (Khusus Admin)
 *     tags: [Master Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               office_address:
 *                 type: string
 *                 example: Jl. Raya Desa No. 01, Kecamatan Maju, Kabupaten Sejahtera 40123
 *               operational_hours:
 *                 type: string
 *                 example: "Senin - Jumat: 08.00 - 15.00 WIB"
 *               operational_description:
 *                 type: string
 *                 example: Sabtu, Minggu dan Hari Libur Nasional Tutup.
 *               phone:
 *                 type: string
 *                 example: 0812-3456-7890
 *               email:
 *                 type: string
 *                 example: kontak@desalaporpak.go.id
 *     responses:
 *       200:
 *         description: Data Informasi Kantor & Kontak Desa berhasil diperbarui
 */
router.put(
  "/office-info",
  authenticateToken,
  requireRole("ADMIN"),
  asyncHandler(masterDataController.updateOfficeInfo)
);

module.exports = router;
