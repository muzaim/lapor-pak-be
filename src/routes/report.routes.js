const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API Pelaporan untuk Pengguna
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Membuat laporan baru (Mendukung upload gambar)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Jalan Rusak di Jalan Merdeka
 *               description:
 *                 type: string
 *                 example: Lubang jalan yang besar dan membahayakan pengendara motor
 *               category:
 *                 type: string
 *                 example: Infrastruktur
 *               location:
 *                 type: string
 *                 example: Jl. Merdeka No. 12
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar pendukung laporan (jpg, jpeg, png, webp, max 5MB)
 *     responses:
 *       201:
 *         description: Laporan berhasil dibuat
 *       400:
 *         description: Data yang dikirim tidak lengkap atau format file tidak valid
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticateToken,
  upload.any(),
  asyncHandler(reportController.createReport)
);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Mendapatkan daftar laporan milik pengguna dengan filter (Pencarian, Status, Kategori, Rentang Tanggal)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian (judul, deskripsi, atau lokasi)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DIAJUKAN, MENUNGGU, DIPROSES, SELESAI, DITOLAK]
 *         description: Filter status laporan
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter kategori laporan
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal mulai (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Daftar laporan dan metadata pagination berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, asyncHandler(reportController.getMyReports));

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Mendapatkan detail laporan milik pengguna berdasarkan ID (Termasuk Riwayat Status)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Laporan
 *     responses:
 *       200:
 *         description: Detail laporan berhasil diambil
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laporan tidak ditemukan atau tidak memiliki akses
 */
router.get("/:id", authenticateToken, asyncHandler(reportController.getMyReportById));
router.get("/detail/:id", authenticateToken, asyncHandler(reportController.getMyReportById));

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Menghapus laporan milik pengguna sendiri berdasarkan ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Laporan
 *     responses:
 *       200:
 *         description: Laporan berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laporan tidak ditemukan atau tidak memiliki akses
 */
router.delete("/:id", authenticateToken, asyncHandler(reportController.deleteMyReport));
router.delete("/detail/:id", authenticateToken, asyncHandler(reportController.deleteMyReport));

module.exports = router;
