const ReportModel = require("../modles/report.model");

async function createReport(req, res) {
  const { title, description, category, location } = req.body;
  if (!title || !description || !category || !location) {
    return res
      .status(400)
      .json({ message: "Title, descripton, category, location are required" });
  }
  const userId = req.user.id;

  constreportId = await ReportModel.createReport({
    userId,
    title,
    description,
    category,
    location,
  });
  const createReport = await ReportModel.getReportByIdAndUser(reportId, userId);

  return res.status(201).json({
    message: 'report created succesfully',
    data : createReport
  });
}

async function getMyReports(req, res) {
    const userId = req.user.id;
    const reports = await ReportModel.getRepotrsByUserId(userId);

    return res.status(200).json({
        message: 'Report retrieved succesfully',
        data: reports
    });
}

async function getMyReportById(req, res){
    const reportId = req.params.id;
    const userId = req.user.id;


const reportExist =  await ReportModel.getMyReportById(reprotId);
if (!reportExist){
    return res.stattus(404).json({message: 'Forbidden: You do not have acces to this report '});
}

const report = await ReportModel.getReportByIdAndUser(reportId, userId);

return res.status(200).json ({
    message: 'Report details retieved succesfully',
    data: report
});
}

module.exports = {
    createReport,
    getMyReports,
    getMyReportById,
};