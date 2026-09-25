const ReportModel = require("../models/report.model");

function extractUploadedImages(req) {
  const imageUrls = [];

  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach((f) => {
        const url = `/uploads/${f.filename}`;
        if (!imageUrls.includes(url)) imageUrls.push(url);
      });
    } else if (typeof req.files === "object") {
      Object.keys(req.files).forEach((key) => {
        if (Array.isArray(req.files[key])) {
          req.files[key].forEach((f) => {
            const url = `/uploads/${f.filename}`;
            if (!imageUrls.includes(url)) imageUrls.push(url);
          });
        }
      });
    }
  }

  if (req.file) {
    const url = `/uploads/${req.file.filename}`;
    if (!imageUrls.includes(url)) imageUrls.push(url);
  }

  return imageUrls;
}

async function createReport(req, res) {
  const { title, description, category, location } = req.body;
  if (!title || !description || !category || !location) {
    return res
      .status(400)
      .json({ message: "Title, description, category, and location are required" });
  }
  const userId = req.user.id;
  const imageUrls = extractUploadedImages(req);
  const imageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

  const reportId = await ReportModel.createReport({
    userId,
    title,
    description,
    category,
    location,
    imageUrl,
    imageUrls,
  });

  // Catat riwayat awal pembuatan laporan oleh user
  await ReportModel.addReportHistory({
    reportId,
    userId,
    previousStatus: null,
    newStatus: "DIAJUKAN",
    comment: "Laporan dibuat oleh pengguna",
    imageUrl: null,
    imageUrls: [],
  });

  const createdReport = await ReportModel.getReportByIdAndUser(reportId, userId);

  return res.status(201).json({
    message: "Report created successfully",
    data: createdReport,
  });
}

async function getMyReports(req, res) {
  const userId = req.user.id;
  const {
    search,
    status,
    category,
    start_date,
    end_date,
    startDate,
    endDate,
    from,
    to,
    page,
    limit,
  } = req.query;

  const filterStartDate = start_date || startDate || from;
  const filterEndDate = end_date || endDate || to;

  const result = await ReportModel.getReportsByUserId(userId, {
    search,
    statusFilter: status,
    category,
    startDate: filterStartDate,
    endDate: filterEndDate,
    page,
    limit,
  });

  return res.status(200).json({
    message: "Reports retrieved successfully",
    data: result.reports,
    pagination: result.pagination,
  });
}

async function getMyReportById(req, res) {
  const reportId = req.params.id;
  const userId = req.user.id;

  const report = await ReportModel.getReportByIdAndUser(reportId, userId);
  if (!report) {
    return res.status(404).json({ message: "Report not found or access denied" });
  }

  return res.status(200).json({
    message: "Report details retrieved successfully",
    data: report,
  });
}

async function deleteMyReport(req, res) {
  const reportId = req.params.id;
  const userId = req.user.id;

  const report = await ReportModel.getReportByIdAndUser(reportId, userId);
  if (!report) {
    return res.status(404).json({ message: "Report not found or access denied" });
  }

  await ReportModel.deleteReport(reportId);

  return res.status(200).json({
    message: "Report deleted successfully",
  });
}

module.exports = {
  createReport,
  getMyReports,
  getMyReportById,
  deleteMyReport,
};