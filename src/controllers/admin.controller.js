const ReportModel = require('../models/report.model');
const VALID_STATUSES = ['PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'];

async function getAllReports(req, res) {
    const { status } = req.query;

    if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            message: `Invalid status filter. Allowed values: ${VALID_STATUSES.join(', ')}`
        });
    }
    const reports = await ReportModel.getAllReports(status);

    return res.status(200).json({
        message: 'All reports retrieved successfully',
        data: reports
    });
}

async function getReportsById(req, res) {
    const reportId = req.params.id;
    const report = await ReportModel.getReportDetailForAdmin(reportId);

    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }
    return res.status(200).json({
        message: 'Report detail retrieved successfully',
        data: report
    });
}

async function updatereportStatus(req, res) {
    const reportId = req.params.id;
    const { status, admin_response } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Status must be one of: ${VALID_STATUSES.join(', ')}`
        });
    }
    const reportExist = await ReportModel.getReportById(reportId);
    if (!reportExist) {
        return res.status(404).json({ message: 'Report not found' });
    }
    const updateResponse = admin_response !== undefined ? admin_response : reportExist.admin_response;
    await ReportModel.updateReportStatusAndResponse(reportId, status, updateResponse);

    const updatedReport = await ReportModel.getReportDetailForAdmin(reportId);

    return res.status(200).json({
        message: 'Report updated successfully',
        data: updatedReport
    });
}

module.exports = {
    getAllReports,
    getReportsById,
    updatereportStatus
};