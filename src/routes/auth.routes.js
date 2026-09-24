const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../middlewares/error.middleware");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", authenticateToken, asyncHandler(authController.getProfile));

module.exports = router;
