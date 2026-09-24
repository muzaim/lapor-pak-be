const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
// const reportRoutes = require('./routes/report.routes');
// const adminRoutes = require('/routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/admin', adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Lapor Pak API Running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);

module.exports = app;
