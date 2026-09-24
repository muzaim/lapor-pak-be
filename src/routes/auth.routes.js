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

module.exports = router;
