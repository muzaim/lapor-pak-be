const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API Manajemen Laporan khusus Admin
 */

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Mendapatkan semua laporan (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, RESOLVED, REJECTED]
 *         description: Filter laporan berdasarkan status
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua laporan
 *       400:
 *         description: Status filter tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Admin)
 */
router.get("/reports", authenticateToken, requireRole("ADMIN"), asyncHandler(adminController.getAllReports));

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   get:
 *     summary: Mendapatkan detail laporan berdasarkan ID (Khusus Admin)
 *     tags: [Admin]
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
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.get("/reports/:id", authenticateToken, requireRole("ADMIN"), asyncHandler(adminController.getReportsById));

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   patch:
 *     summary: Memperbarui status dan respon admin pada laporan (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Laporan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_REVIEW, RESOLVED, REJECTED]
 *                 example: IN_REVIEW
 *               admin_response:
 *                 type: string
 *                 example: Laporan sedang ditinjau oleh tim lapangan.
 *     responses:
 *       200:
 *         description: Status laporan berhasil diperbarui
 *       400:
 *         description: Status tidak valid atau kosong
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.patch("/reports/:id", authenticateToken, requireRole("ADMIN"), asyncHandler(adminController.updatereportStatus));

module.exports = router;