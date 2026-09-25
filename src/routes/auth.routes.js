const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API Autentikasi Pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Auth]
 *     security: []
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Berhasil registrasi pengguna
 *       400:
 *         description: Input tidak valid
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/register", asyncHandler(authController.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil dan mengembalikan JWT token
 *       400:
 *         description: Email dan password diperlukan
 *       401:
 *         description: Kredensial tidak valid
 */
router.post("/login", asyncHandler(authController.login));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan profil pengguna yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil pengguna berhasil diambil
 *       401:
 *         description: Unauthorized / Token tidak valid
 */
router.get("/me", authenticateToken, asyncHandler(authController.getProfile));

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Mengubah password pengguna yang sedang login (User / Admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: user123
 *                 description: Password lama (bisa menggunakan key `old_password` atau `current_password`)
 *               new_password:
 *                 type: string
 *                 example: newpassword123
 *                 description: Password baru (minimal 6 karakter)
 *     responses:
 *       200:
 *         description: Password berhasil diperbarui
 *       400:
 *         description: Password lama salah, password kurang dari 6 karakter, atau input tidak lengkap
 *       401:
 *         description: Unauthorized / Token tidak valid
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.put(
  "/change-password",
  authenticateToken,
  asyncHandler(authController.changePassword)
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Mereset password akun menjadi '123456'
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *                 description: Email pengguna yang ingin direset
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: ID pengguna yang ingin direset
 *     responses:
 *       200:
 *         description: Password berhasil direset menjadi 123456
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.put("/reset-password", asyncHandler(authController.resetPassword));
router.post("/reset", asyncHandler(authController.resetPassword));
router.put("/reset", asyncHandler(authController.resetPassword));

module.exports = router;
