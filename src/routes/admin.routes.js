const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

// Proteksi seluruh route admin: Membutuhkan Token + Role ADMIN
router.use(authenticateToken);
router.use(requireRole("ADMIN"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API Manajemen Laporan & Pengguna khusus Admin
 */

// ============================================================
// USER MANAGEMENT ROUTES (CRUD ADMIN)
// ============================================================

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Mendapatkan semua daftar pengguna terdaftar (Dengan Pagination - Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Berhasil mengambil semua data pengguna
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Admin)
 */
router.get("/users", asyncHandler(adminController.getAllUsers));

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Menambahkan pengguna baru oleh Admin (USER / ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmad Staff
 *               email:
 *                 type: string
 *                 example: ahmad@laporpak.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 default: USER
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Pengguna berhasil dibuat oleh admin
 *       400:
 *         description: Input tidak valid
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/users", asyncHandler(adminController.createUser));

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Mendapatkan detail pengguna berdasarkan ID (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.get("/users/:id", asyncHandler(adminController.getUserById));

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Memperbarui data pengguna (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmad Staff Edit
 *               email:
 *                 type: string
 *                 example: ahmad.edit@laporpak.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 example: USER
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.put("/users/:id", asyncHandler(adminController.updateUser));

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Menghapus pengguna berdasarkan ID (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       400:
 *         description: Tidak bisa menghapus akun sendiri yang sedang login
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.delete("/users/:id", asyncHandler(adminController.deleteUser));

/**
 * @swagger
 * /api/admin/users/{id}/reset-password:
 *   post:
 *     summary: Mereset password pengguna tertentu menjadi '123456' (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pengguna
 *     responses:
 *       200:
 *         description: Password pengguna berhasil direset menjadi 123456
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.post("/users/:id/reset-password", asyncHandler(adminController.resetUserPassword));
router.put("/users/:id/reset-password", asyncHandler(adminController.resetUserPassword));
router.post("/users/:id/reset", asyncHandler(adminController.resetUserPassword));
router.put("/users/:id/reset", asyncHandler(adminController.resetUserPassword));
router.post("/users/reset-password/:id", asyncHandler(adminController.resetUserPassword));
router.put("/users/reset-password/:id", asyncHandler(adminController.resetUserPassword));

// ============================================================
// REPORT MANAGEMENT ROUTES (ADMIN)
// ============================================================

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Mendapatkan semua laporan dengan pencarian, filter status, kategori & rentang tanggal (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian (nama pelapor, judul, deskripsi, atau lokasi)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DIAJUKAN, MENUNGGU, DIPROSES, SELESAI, DITOLAK]
 *         description: Filter laporan berdasarkan status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kategori (misal Infrastruktur)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal awal filter (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir filter (YYYY-MM-DD)
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
 *         description: Berhasil mengambil semua laporan sesuai filter
 */
router.get("/reports", asyncHandler(adminController.getAllReports));

/**
 * @swagger
 * /api/admin/reports/export:
 *   get:
 *     summary: Export data laporan ke file Excel (.xlsx) berdasar filter (Khusus Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian (nama pelapor, judul, deskripsi, atau lokasi)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DIAJUKAN, MENUNGGU, DIPROSES, SELESAI, DITOLAK]
 *         description: Filter laporan berdasarkan status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kategori
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal awal filter (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: File Excel (.xlsx) berisi data laporan terfilter dengan header berwarna biru
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/reports/export", asyncHandler(adminController.exportReports));

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   get:
 *     summary: Mendapatkan detail laporan dan riwayat status berdasarkan ID (Khusus Admin)
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
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.get("/reports/:id", asyncHandler(adminController.getReportsById));
router.get("/reports/detail/:id", asyncHandler(adminController.getReportsById));

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   patch:
 *     summary: Memperbarui status laporan, komentar & lampiran foto riwayat (Khusus Admin)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DIAJUKAN, MENUNGGU, DIPROSES, SELESAI, DITOLAK]
 *                 example: DIPROSES
 *               comment:
 *                 type: string
 *                 example: Petugas sudah menuju lokasi untuk melakukan survei awal.
 *               admin_response:
 *                 type: string
 *                 example: Petugas sedang di lapangan.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto bukti penanganan/pengerjaan (Opsional)
 *     responses:
 *       200:
 *         description: Status laporan dan riwayat foto berhasil diperbarui
 */
router.patch(
  "/reports/:id",
  upload.any(),
  asyncHandler(adminController.updatereportStatus)
);
router.patch(
  "/reports/detail/:id",
  upload.any(),
  asyncHandler(adminController.updatereportStatus)
);

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   delete:
 *     summary: Menghapus laporan berdasarkan ID (Khusus Admin)
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
 *         description: Laporan berhasil dihapus oleh admin
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.delete("/reports/:id", asyncHandler(adminController.deleteReport));
router.delete("/reports/detail/:id", asyncHandler(adminController.deleteReport));

module.exports = router;