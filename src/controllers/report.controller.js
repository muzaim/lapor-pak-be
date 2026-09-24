const ReportModel = require("../models/report.model");

async function createReport(req, res) {
  const { title, description, category, location } = req.body;
  if (!title || !description || !category || !location) {
    return res
      .status(400)
      .json({ message: "Title, description, category, location are required" });
  }
  const userId = req.user.id;

  const reportId = await ReportModel.createReport({
    userId,
    title,
    description,
    category,
    location,
  });
  const createdReport = await ReportModel.getReportByIdAndUser(reportId, userId);

  return res.status(201).json({
    message: "Report created successfully",
    data: createdReport,
  });
}

async function getMyReports(req, res) {
  const userId = req.user.id;
  const reports = await ReportModel.getReportsByUserId(userId);

  return res.status(200).json({
    message: "Reports retrieved successfully",
    data: reports,
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

module.exports = {
  createReport,
  getMyReports,
  getMyReportById,
};