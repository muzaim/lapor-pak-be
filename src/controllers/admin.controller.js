const bcrypt = require("bcrypt");
const ExcelJS = require("exceljs");
const ReportModel = require("../models/report.model");
const UserModel = require("../models/user.model");

const VALID_STATUSES = ["DIAJUKAN", "MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];
const VALID_ROLES = ["USER", "ADMIN"];

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

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

// ============================================================
// REPORT MANAGEMENT (ADMIN)
// ============================================================

async function getAllReports(req, res) {
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

  const filterStatus = status;
  const filterStartDate = start_date || startDate || from;
  const filterEndDate = end_date || endDate || to;

  if (filterStatus && !VALID_STATUSES.includes(filterStatus)) {
    return res.status(400).json({
      message: `Invalid status filter. Allowed values: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const result = await ReportModel.getAllReports({
    search,
    statusFilter: filterStatus,
    category,
    startDate: filterStartDate,
    endDate: filterEndDate,
    page,
    limit,
  });

  return res.status(200).json({
    message: "All reports retrieved successfully",
    data: result.reports,
    pagination: result.pagination,
  });
}

async function exportReports(req, res) {
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
  } = req.query;

  const filterStatus = status;
  const filterStartDate = start_date || startDate || from;
  const filterEndDate = end_date || endDate || to;

  if (filterStatus && !VALID_STATUSES.includes(filterStatus)) {
    return res.status(400).json({
      message: `Invalid status filter. Allowed values: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const reports = await ReportModel.getReportsForExport({
    search,
    statusFilter: filterStatus,
    category,
    startDate: filterStartDate,
    endDate: filterEndDate,
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Lapor Pak App";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Data Laporan");

  worksheet.columns = [
    { header: "No", key: "no", width: 8, style: { alignment: { horizontal: "center", vertical: "middle" } } },
    { header: "Tanggal", key: "tanggal", width: 20 },
    { header: "Judul", key: "judul", width: 30 },
    { header: "Deskripsi Lengkap", key: "deskripsi", width: 45 },
    { header: "Kategori", key: "kategori", width: 20 },
    { header: "Lokasi", key: "lokasi", width: 30 },
    { header: "Status", key: "status", width: 15, style: { alignment: { horizontal: "center", vertical: "middle" } } },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1976D2" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  headerRow.height = 25;

  const monthsID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  reports.forEach((item, index) => {
    let formattedDate = "-";
    if (item.created_at) {
      const d = new Date(item.created_at);
      if (!isNaN(d.getTime())) {
        formattedDate = `${d.getDate()} ${monthsID[d.getMonth()]} ${d.getFullYear()}`;
      }
    }

    const row = worksheet.addRow({
      no: index + 1,
      tanggal: formattedDate,
      judul: item.title || "-",
      deskripsi: item.description || "-",
      kategori: item.category || "-",
      lokasi: item.location || "-",
      status: item.status || "-",
    });

    row.height = 20;
    row.alignment = { vertical: "middle", wrapText: true };
  });

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "D3D3D3" } },
        left: { style: "thin", color: { argb: "D3D3D3" } },
        bottom: { style: "thin", color: { argb: "D3D3D3" } },
        right: { style: "thin", color: { argb: "D3D3D3" } },
      };
    });
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `Laporan_Lapor_Pak_${timestamp}.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  await workbook.xlsx.write(res);
  res.end();
}

async function getReportsById(req, res) {
  const reportId = req.params.id;
  const report = await ReportModel.getReportDetailForAdmin(reportId);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }
  return res.status(200).json({
    message: "Report detail and status histories retrieved successfully",
    data: report,
  });
}

/**
 * Proses Perubahan Status Laporan oleh Admin (Mendukung Opsional Lampiran Foto & Komentar)
 */
async function updatereportStatus(req, res) {
  const reportId = req.params.id;
  const { status, admin_response, comment } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const reportExist = await ReportModel.getReportById(reportId);
  if (!reportExist) {
    return res.status(404).json({ message: "Report not found" });
  }

  const previousStatus = reportExist.status;

  // Tangkap file foto opsional (bisa multiple) yang diupload admin
  const historyImageUrls = extractUploadedImages(req);
  const historyImageUrl = historyImageUrls.length > 0 ? historyImageUrls[0] : null;

  // Gunakan komentar dari req.body atau sediakan komentar default
  let finalComment = comment || admin_response;

  if (!finalComment || finalComment.trim() === "") {
    switch (status) {
      case "DIAJUKAN":
        finalComment = "Laporan diajukan";
        break;
      case "MENUNGGU":
        finalComment = "Laporan sedang dalam antrean peninjauan";
        break;
      case "DIPROSES":
        finalComment = "Laporan sedang dalam proses penanganan oleh petugas/admin";
        break;
      case "SELESAI":
        finalComment = "Laporan telah selesai ditindaklanjuti dan diselesaikan";
        break;
      case "DITOLAK":
        finalComment = "Laporan ditolak oleh admin";
        break;
      default:
        finalComment = `Status laporan diperbarui dari ${previousStatus} ke ${status}`;
    }
  }

  // 1. Update status dan respon admin pada tabel reports
  await ReportModel.updateReportStatusAndResponse(reportId, status, finalComment);

  // 2. Tambahkan catatan ke riwayat (report_histories) beserta opsional foto (multiple)
  await ReportModel.addReportHistory({
    reportId,
    userId: req.user.id,
    previousStatus,
    newStatus: status,
    comment: finalComment,
    imageUrl: historyImageUrl,
    imageUrls: historyImageUrls,
  });

  // 3. Ambil data detail laporan terbaru beserta array riwayat (histories)
  const updatedReport = await ReportModel.getReportDetailForAdmin(reportId);

  return res.status(200).json({
    message: `Status laporan berhasil diperbarui dari ${previousStatus} menjadi ${status}`,
    data: updatedReport,
  });
}

async function deleteReport(req, res) {
  const reportId = req.params.id;
  const reportExist = await ReportModel.getReportById(reportId);
  if (!reportExist) {
    return res.status(404).json({ message: "Report not found" });
  }

  await ReportModel.deleteReport(reportId);

  return res.status(200).json({
    message: "Report deleted successfully by admin",
  });
}

// ============================================================
// USER MANAGEMENT (CRUD ADMIN)
// ============================================================

async function getAllUsers(req, res) {
  const { page, limit } = req.query;
  const result = await UserModel.getAllUsers({ page, limit });

  return res.status(200).json({
    message: "All users retrieved successfully",
    data: result.users,
    pagination: result.pagination,
  });
}

async function getUserById(req, res) {
  const userId = req.params.id;
  const user = await UserModel.findUserById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "User detail retrieved successfully",
    data: user,
  });
}

async function createUser(req, res) {
  const { name, email, password, role = "USER" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Allowed roles: ${VALID_ROLES.join(", ")}` });
  }

  const existingUser = await UserModel.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await UserModel.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const newUser = await UserModel.findUserById(userId);

  return res.status(201).json({
    message: "User created successfully by admin",
    data: newUser,
  });
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;

  const existingUser = await UserModel.findUserById(userId);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (email && email !== existingUser.email) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const checkEmail = await UserModel.findUserByEmail(email);
    if (checkEmail) {
      return res.status(409).json({ message: "Email already in use by another account" });
    }
  }

  if (password && password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Allowed roles: ${VALID_ROLES.join(", ")}` });
  }

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await UserModel.updateUser(userId, {
    name,
    email,
    password: hashedPassword,
    role,
  });

  return res.status(200).json({
    message: "User updated successfully",
    data: updatedUser,
  });
}

async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);

  if (req.user.id === userId) {
    return res.status(400).json({ message: "You cannot delete your own logged-in admin account" });
  }

  const existingUser = await UserModel.findUserById(userId);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  await UserModel.deleteUser(userId);

  return res.status(200).json({
    message: "User deleted successfully",
  });
}

async function resetUserPassword(req, res) {
  const userId = req.params.id || req.body.id || req.body.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await UserModel.findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const DEFAULT_PASSWORD = "123456";
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  await UserModel.updatePassword(user.id, hashedPassword);

  return res.status(200).json({
    message: `Password pengguna ${user.name} berhasil direset menjadi ${DEFAULT_PASSWORD}`,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      default_password: DEFAULT_PASSWORD,
    },
  });
}

module.exports = {
  getAllReports,
  exportReports,
  getReportsById,
  updatereportStatus,
  deleteReport,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
};