const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const reportRoutes = require("./routes/report.routes");
const adminRoutes = require("./routes/admin.routes");
const setupSwagger = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger Documentation
setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

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
