const express = require("express");
const cors = require("cors");
const path = require("path");
const { errorHandler } = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const reportRoutes = require("./routes/report.routes");
const adminRoutes = require("./routes/admin.routes");
const villageRoutes = require("./routes/village.routes");
const masterDataRoutes = require("./routes/master_data.routes");
const setupSwagger = require("./config/swagger");

const app = express();

// Konfigurasi CORS Lengkap & Fleksibel
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded report images, logos & banners
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Setup Swagger Documentation
setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/village", villageRoutes);
app.use("/api/master", masterDataRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Cek status server
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server berjalan normal
 */
app.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", message: "Lapor Pak API Running" });
});

app.use((req, res) => {
	res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);

module.exports = app;
