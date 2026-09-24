const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticateToken = require("../middlewares/auth.middleware");
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
 *     summary: Membuat laporan baru
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *     responses:
 *       201:
 *         description: Laporan berhasil dibuat
 *       400:
 *         description: Data yang dikirim tidak lengkap
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, asyncHandler(reportController.createReport));

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Mendapatkan daftar laporan milik pengguna yang sedang login
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar laporan berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, asyncHandler(reportController.getMyReports));

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Mendapatkan detail laporan milik pengguna berdasarkan ID
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

module.exports = router;
