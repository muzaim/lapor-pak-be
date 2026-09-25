const express = require("express");
const router = express.Router();
const villageController = require("../controllers/village.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

/**
 * @swagger
 * tags:
 *   name: Village Profile
 *   description: API Master Data & Profil Desa (Visi Misi, Kepala Desa, Lokasi, dll)
 */

/**
 * @swagger
 * /api/village:
 *   get:
 *     summary: Mendapatkan Master Data & Profil Desa
 *     tags: [Village Profile]
 *     security: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil profil desa
 */
router.get("/", asyncHandler(villageController.getProfile));

/**
 * @swagger
 * /api/village:
 *   put:
 *     summary: Memperbarui Master Data & Profil Desa (Khusus Admin)
 *     tags: [Village Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               village_name:
 *                 type: string
 *                 example: Desa Sukamaju
 *               head_of_village:
 *                 type: string
 *                 example: Bpk. H. Ahmad Sanusi
 *               vision:
 *                 type: string
 *                 example: Terwujudnya Desa yang Maju, Sejahtera, dan Transparan.
 *               mission:
 *                 type: string
 *                 example: 1. Pelayanan publik digital. 2. Pembangunan infrastruktur merata.
 *               address:
 *                 type: string
 *                 example: Jl. Raya Desa Sukamaju No. 01
 *               phone:
 *                 type: string
 *                 example: 0812-3456-7890
 *               email:
 *                 type: string
 *                 example: kontak@desasukamaju.go.id
 *               description:
 *                 type: string
 *                 example: Profil singkat desa Sukamaju.
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: File logo desa (jpg, png, webp)
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: File foto/banner desa (jpg, png, webp)
 *     responses:
 *       200:
 *         description: Profil desa berhasil diperbarui
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Admin)
 */
router.put(
  "/",
  authenticateToken,
  requireRole("ADMIN"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  asyncHandler(villageController.updateProfile)
);

module.exports = router;
