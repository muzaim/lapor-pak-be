const db = require("../config/database");

function generateTicketCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function parseImageUrls(imageUrl, tableImages = []) {
  if (Array.isArray(tableImages) && tableImages.length > 0) {
    return Array.from(new Set(tableImages));
  }
  if (!imageUrl || typeof imageUrl !== "string") return [];
  const urls = imageUrl.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  return Array.from(new Set(urls));
}

function getPrimaryImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const urls = imageUrl.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  return urls.length > 0 ? urls[0] : null;
}

async function initDatabaseSchema() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS report_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_report_images_reports FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (e) {}

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS report_history_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        history_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_history_images_histories FOREIGN KEY (history_id) REFERENCES report_histories (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (e) {}

  try {
    const [cols] = await db.query(`SHOW COLUMNS FROM reports LIKE 'ticket_code'`);
    if (cols.length === 0) {
      await db.query(`ALTER TABLE reports ADD COLUMN ticket_code VARCHAR(50) UNIQUE DEFAULT NULL AFTER id`);
      await db.query(`UPDATE reports SET ticket_code = CONCAT('LP', LPAD(id, 6, '0')) WHERE ticket_code IS NULL`);
    }
  } catch (e) {}
}

initDatabaseSchema().catch(() => {});

async function saveReportImages(reportId, imageUrls = []) {
  if (!imageUrls || imageUrls.length === 0) return;
  try {
    const values = imageUrls.map((url) => [reportId, url]);
    await db.query(`INSERT INTO report_images (report_id, image_url) VALUES ?`, [values]);
  } catch (err) {
    console.warn("Notice: report_images table skip/insert warning:", err.message);
  }
}

async function getReportImages(reportId) {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT image_url FROM report_images WHERE report_id = ? ORDER BY id ASC`,
      [reportId]
    );
    return rows.map((r) => r.image_url);
  } catch (err) {
    return [];
  }
}

async function saveHistoryImages(historyId, imageUrls = []) {
  if (!imageUrls || imageUrls.length === 0) return;
  try {
    const values = imageUrls.map((url) => [historyId, url]);
    await db.query(`INSERT INTO report_history_images (history_id, image_url) VALUES ?`, [values]);
  } catch (err) {
    console.warn("Notice: report_history_images table skip/insert warning:", err.message);
  }
}

async function getHistoryImages(historyId) {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT image_url FROM report_history_images WHERE history_id = ? ORDER BY id ASC`,
      [historyId]
    );
    return rows.map((r) => r.image_url);
  } catch (err) {
    return [];
  }
}

async function createReport({
  userId,
  title,
  description,
  category,
  location,
  imageUrl = null,
  imageUrls = [],
  status = "DIAJUKAN",
  ticketCode = null,
}) {
  const finalImageUrls = Array.isArray(imageUrls) && imageUrls.length > 0
    ? imageUrls
    : (imageUrl ? imageUrl.split(",").map((s) => s.trim()) : []);

  const uniqueImageUrls = Array.from(new Set(finalImageUrls.filter((s) => s && s.length > 0)));
  const storedImageUrl = uniqueImageUrls.join(",");
  const finalTicketCode = ticketCode || generateTicketCode();

  let reportId;
  try {
    const [result] = await db.query(
      `INSERT INTO reports (ticket_code, user_id, title, description, category, location, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [finalTicketCode, userId, title, description, category, location, storedImageUrl || null, status]
    );
    reportId = result.insertId;
  } catch (err) {
    const [result] = await db.query(
      `INSERT INTO reports (user_id, title, description, category, location, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, category, location, storedImageUrl || null, status]
    );
    reportId = result.insertId;
  }

  if (uniqueImageUrls.length > 0) {
    await saveReportImages(reportId, uniqueImageUrls);
  }

  return reportId;
}

async function addReportHistory({
  reportId,
  userId,
  previousStatus = null,
  newStatus,
  comment = null,
  imageUrl = null,
  imageUrls = [],
}) {
  const finalImageUrls = Array.isArray(imageUrls) && imageUrls.length > 0
    ? imageUrls
    : (imageUrl ? imageUrl.split(",").map((s) => s.trim()) : []);

  const uniqueImageUrls = Array.from(new Set(finalImageUrls.filter((s) => s && s.length > 0)));
  const storedImageUrl = uniqueImageUrls.join(",");

  const [result] = await db.query(
    `INSERT INTO report_histories (report_id, user_id, previous_status, new_status, comment, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
    [reportId, userId, previousStatus, newStatus, comment, storedImageUrl || null]
  );
  const historyId = result.insertId;

  if (uniqueImageUrls.length > 0) {
    await saveHistoryImages(historyId, uniqueImageUrls);
  }

  return historyId;
}

async function getReportHistories(reportId) {
  const [rows] = await db.query(
    `SELECT h.id, h.report_id, h.previous_status, h.new_status, h.comment, h.image_url, h.created_at,
            u.id as user_id, u.name as user_name, u.role as user_role
     FROM report_histories h
     JOIN users u ON h.user_id = u.id
     WHERE h.report_id = ?
     ORDER BY h.created_at ASC`,
    [reportId]
  );

  const histories = [];
  for (const row of rows) {
    const tableImages = await getHistoryImages(row.id);
    const images = parseImageUrls(row.image_url, tableImages);
    const primaryImageUrl = getPrimaryImageUrl(row.image_url);

    histories.push({
      id: row.id,
      previous_status: row.previous_status,
      new_status: row.new_status,
      comment: row.comment,
      image_url: primaryImageUrl,
      images: images,
      created_at: row.created_at,
      actor: {
        id: row.user_id,
        name: row.user_name,
        role: row.user_role,
      },
    });
  }

  return histories;
}

async function getReportsByUserId(
  userId,
  {
    search = null,
    statusFilter = null,
    category = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 10,
  } = {}
) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const offset = (pageNum - 1) * limitNum;

  let countQuery = "SELECT COUNT(*) as total FROM reports r JOIN users u ON r.user_id = u.id WHERE r.user_id = ? ";
  let dataQuery = `SELECT r.*, u.name as reporter_name, u.email as reporter_email 
                   FROM reports r JOIN users u ON r.user_id = u.id WHERE r.user_id = ? `;

  const whereClauses = [];
  const params = [userId];

  if (search && search.trim() !== "") {
    whereClauses.push("(u.name LIKE ? OR r.title LIKE ? OR r.description LIKE ? OR r.location LIKE ?)");
    const pattern = `%${search.trim()}%`;
    params.push(pattern, pattern, pattern, pattern);
  }

  if (statusFilter && statusFilter.trim() !== "") {
    whereClauses.push("r.status = ?");
    params.push(statusFilter.trim());
  }

  if (category && category.trim() !== "") {
    whereClauses.push("r.category = ?");
    params.push(category.trim());
  }

  if (startDate && startDate.trim() !== "") {
    whereClauses.push("r.created_at >= ?");
    params.push(`${startDate.trim()} 00:00:00`);
  }

  if (endDate && endDate.trim() !== "") {
    whereClauses.push("r.created_at <= ?");
    params.push(`${endDate.trim()} 23:59:59`);
  }

  if (whereClauses.length > 0) {
    const whereStr = "AND " + whereClauses.join(" AND ");
    countQuery += whereStr;
    dataQuery += whereStr;
  }

  const [countRows] = await db.query(countQuery, params);
  const totalItems = countRows[0].total;

  dataQuery += " ORDER BY r.created_at DESC LIMIT ? OFFSET ?";
  const dataParams = [...params, limitNum, offset];

  const [rows] = await db.query(dataQuery, dataParams);
  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  const reports = [];
  for (const row of rows) {
    const tableImages = await getReportImages(row.id);
    const images = parseImageUrls(row.image_url, tableImages);
    const primaryImageUrl = getPrimaryImageUrl(row.image_url);

    reports.push({
      ...row,
      ticket_code: row.ticket_code || `LP${String(row.id).padStart(6, '0')}`,
      image_url: primaryImageUrl,
      images: images,
    });
  }

  return {
    reports,
    pagination: {
      total_items: totalItems,
      total_pages: totalPages,
      current_page: pageNum,
      limit: limitNum,
      has_next: pageNum < totalPages,
      has_prev: pageNum > 1,
    },
  };
}

async function getReportByIdAndUser(identifier, userId) {
  let rows = [];
  const isNumeric = !isNaN(identifier) && !isNaN(parseInt(identifier)) && String(parseInt(identifier)) === String(identifier).trim();

  try {
    if (isNumeric) {
      const [res] = await db.query(
        `SELECT r.*, u.id as reporter_id, u.name as user_name, u.email as user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         WHERE (r.id = ? OR r.ticket_code = ?) AND r.user_id = ?`,
        [parseInt(identifier), String(identifier), userId]
      );
      rows = res;
    } else {
      const [res] = await db.query(
        `SELECT r.*, u.id as reporter_id, u.name as user_name, u.email as user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         WHERE r.ticket_code = ? AND r.user_id = ?`,
        [String(identifier), userId]
      );
      rows = res;
    }
  } catch (err) {
    if (isNumeric) {
      const [res] = await db.query(
        `SELECT r.*, u.id as reporter_id, u.name as user_name, u.email as user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ? AND r.user_id = ?`,
        [parseInt(identifier), userId]
      );
      rows = res;
    }
  }

  if (rows.length === 0) return null;
  const row = rows[0];
  const histories = await getReportHistories(row.id);

  const tableImages = await getReportImages(row.id);
  const images = parseImageUrls(row.image_url, tableImages);
  const primaryImageUrl = getPrimaryImageUrl(row.image_url);

  return {
    id: row.id,
    ticket_code: row.ticket_code || `LP${String(row.id).padStart(6, '0')}`,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    image_url: primaryImageUrl,
    images: images,
    status: row.status,
    admin_response: row.admin_response,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: {
      id: row.reporter_id,
      name: row.user_name,
      email: row.user_email,
    },
    reporter_name: row.user_name,
    reporter_email: row.user_email,
    histories,
  };
}

async function getReportById(identifier) {
  const isNumeric = !isNaN(identifier) && !isNaN(parseInt(identifier)) && String(parseInt(identifier)) === String(identifier).trim();
  try {
    if (isNumeric) {
      const [rows] = await db.query(`SELECT * FROM reports WHERE id = ? OR ticket_code = ?`, [parseInt(identifier), String(identifier)]);
      return rows[0] || null;
    } else {
      const [rows] = await db.query(`SELECT * FROM reports WHERE ticket_code = ?`, [String(identifier)]);
      return rows[0] || null;
    }
  } catch (err) {
    if (isNumeric) {
      const [rows] = await db.query(`SELECT * FROM reports WHERE id = ?`, [parseInt(identifier)]);
      return rows[0] || null;
    }
    return null;
  }
}

async function getAllReports({
  search = null,
  statusFilter = null,
  category = null,
  startDate = null,
  endDate = null,
  page = 1,
  limit = 10,
} = {}) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const offset = (pageNum - 1) * limitNum;

  let countQuery = "SELECT COUNT(*) as total FROM reports r JOIN users u ON r.user_id = u.id ";
  let dataQuery = `SELECT r.*, u.name as reporter_name, u.email as reporter_email
    FROM reports r
    JOIN users u ON r.user_id = u.id `;

  const whereClauses = [];
  const params = [];

  if (search && search.trim() !== "") {
    whereClauses.push("(u.name LIKE ? OR r.title LIKE ? OR r.description LIKE ? OR r.location LIKE ?)");
    const pattern = `%${search.trim()}%`;
    params.push(pattern, pattern, pattern, pattern);
  }

  if (statusFilter && statusFilter.trim() !== "") {
    whereClauses.push("r.status = ?");
    params.push(statusFilter.trim());
  }

  if (category && category.trim() !== "") {
    whereClauses.push("r.category = ?");
    params.push(category.trim());
  }

  if (startDate && startDate.trim() !== "") {
    whereClauses.push("r.created_at >= ?");
    params.push(`${startDate.trim()} 00:00:00`);
  }

  if (endDate && endDate.trim() !== "") {
    whereClauses.push("r.created_at <= ?");
    params.push(`${endDate.trim()} 23:59:59`);
  }

  if (whereClauses.length > 0) {
    const whereStr = "WHERE " + whereClauses.join(" AND ");
    countQuery += whereStr;
    dataQuery += whereStr;
  }

  const [countRows] = await db.query(countQuery, params);
  const totalItems = countRows[0].total;

  dataQuery += " ORDER BY r.created_at DESC LIMIT ? OFFSET ?";
  const dataParams = [...params, limitNum, offset];

  const [rows] = await db.query(dataQuery, dataParams);
  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  const reports = [];
  for (const row of rows) {
    const tableImages = await getReportImages(row.id);
    const images = parseImageUrls(row.image_url, tableImages);
    const primaryImageUrl = getPrimaryImageUrl(row.image_url);

    reports.push({
      ...row,
      ticket_code: row.ticket_code || `LP${String(row.id).padStart(6, '0')}`,
      image_url: primaryImageUrl,
      images: images,
    });
  }

  return {
    reports,
    pagination: {
      total_items: totalItems,
      total_pages: totalPages,
      current_page: pageNum,
      limit: limitNum,
      has_next: pageNum < totalPages,
      has_prev: pageNum > 1,
    },
  };
}

async function getReportDetailForAdmin(identifier) {
  let rows = [];
  const isNumeric = !isNaN(identifier) && !isNaN(parseInt(identifier)) && String(parseInt(identifier)) === String(identifier).trim();

  try {
    if (isNumeric) {
      const [res] = await db.query(
        `SELECT r.*, u.id as reporter_id, u.name as user_name, u.email as user_email FROM reports r JOIN users u ON r.user_id = u.id WHERE r.id = ? OR r.ticket_code = ?`,
        [parseInt(identifier), String(identifier)]
      );
      rows = res;
    } else {
      const [res] = await db.query(
        `SELECT r.*, u.id as reporter_id, u.name as user_name, u.email as user_email FROM reports r JOIN users u ON r.user_id = u.id WHERE r.ticket_code = ?`,
        [String(identifier)]
      );
      rows = res;
    }
  } catch (err) {
    if (isNumeric) {
      const [res] = await db.query(
        `SELECT r.*, u.id as reporter_id, u.name as user_name, u.email as user_email FROM reports r JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
        [parseInt(identifier)]
      );
      rows = res;
    }
  }

  if (rows.length === 0) return null;
  const row = rows[0];
  const histories = await getReportHistories(row.id);

  const tableImages = await getReportImages(row.id);
  const images = parseImageUrls(row.image_url, tableImages);
  const primaryImageUrl = getPrimaryImageUrl(row.image_url);

  return {
    id: row.id,
    ticket_code: row.ticket_code || `LP${String(row.id).padStart(6, '0')}`,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    image_url: primaryImageUrl,
    images: images,
    status: row.status,
    admin_response: row.admin_response,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: {
      id: row.reporter_id,
      name: row.user_name,
      email: row.user_email,
    },
    reporter_name: row.user_name,
    reporter_email: row.user_email,
    histories,
  };
}

async function updateReportStatusAndResponse(identifier, status, adminResponse) {
  const isNumeric = !isNaN(identifier) && !isNaN(parseInt(identifier)) && String(parseInt(identifier)) === String(identifier).trim();
  try {
    if (isNumeric) {
      const [result] = await db.query(
        `UPDATE reports SET status = ?, admin_response = ? WHERE id = ? OR ticket_code = ?`,
        [status, adminResponse, parseInt(identifier), String(identifier)]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await db.query(
        `UPDATE reports SET status = ?, admin_response = ? WHERE ticket_code = ?`,
        [status, adminResponse, String(identifier)]
      );
      return result.affectedRows > 0;
    }
  } catch (err) {
    if (isNumeric) {
      const [result] = await db.query(
        `UPDATE reports SET status = ?, admin_response = ? WHERE id = ?`,
        [status, adminResponse, parseInt(identifier)]
      );
      return result.affectedRows > 0;
    }
    return false;
  }
}

async function deleteReport(identifier) {
  const isNumeric = !isNaN(identifier) && !isNaN(parseInt(identifier)) && String(parseInt(identifier)) === String(identifier).trim();
  try {
    if (isNumeric) {
      const [result] = await db.query("DELETE FROM reports WHERE id = ? OR ticket_code = ?", [parseInt(identifier), String(identifier)]);
      return result.affectedRows > 0;
    } else {
      const [result] = await db.query("DELETE FROM reports WHERE ticket_code = ?", [String(identifier)]);
      return result.affectedRows > 0;
    }
  } catch (err) {
    if (isNumeric) {
      const [result] = await db.query("DELETE FROM reports WHERE id = ?", [parseInt(identifier)]);
      return result.affectedRows > 0;
    }
    return false;
  }
}

async function getReportsForExport({
  search = null,
  statusFilter = null,
  category = null,
  startDate = null,
  endDate = null,
} = {}) {
  let dataQuery = `SELECT r.*, u.name as reporter_name, u.email as reporter_email
    FROM reports r
    JOIN users u ON r.user_id = u.id `;

  const whereClauses = [];
  const params = [];

  if (search && search.trim() !== "") {
    whereClauses.push("(u.name LIKE ? OR r.title LIKE ? OR r.description LIKE ? OR r.location LIKE ?)");
    const pattern = `%${search.trim()}%`;
    params.push(pattern, pattern, pattern, pattern);
  }

  if (statusFilter && statusFilter.trim() !== "") {
    whereClauses.push("r.status = ?");
    params.push(statusFilter.trim());
  }

  if (category && category.trim() !== "") {
    whereClauses.push("r.category = ?");
    params.push(category.trim());
  }

  if (startDate && startDate.trim() !== "") {
    whereClauses.push("r.created_at >= ?");
    params.push(`${startDate.trim()} 00:00:00`);
  }

  if (endDate && endDate.trim() !== "") {
    whereClauses.push("r.created_at <= ?");
    params.push(`${endDate.trim()} 23:59:59`);
  }

  if (whereClauses.length > 0) {
    dataQuery += "WHERE " + whereClauses.join(" AND ");
  }

  dataQuery += " ORDER BY r.created_at DESC";

  const [rows] = await db.query(dataQuery, params);

  const reports = [];
  for (const row of rows) {
    const tableImages = await getReportImages(row.id);
    const images = parseImageUrls(row.image_url, tableImages);
    const primaryImageUrl = getPrimaryImageUrl(row.image_url);

    reports.push({
      ...row,
      ticket_code: row.ticket_code || `LP${String(row.id).padStart(6, '0')}`,
      image_url: primaryImageUrl,
      images: images,
    });
  }

  return reports;
}

module.exports = {
  createReport,
  addReportHistory,
  getReportHistories,
  getReportsByUserId,
  getReportByIdAndUser,
  getReportById,
  getAllReports,
  getReportsForExport,
  getReportDetailForAdmin,
  updateReportStatusAndResponse,
  deleteReport,
  saveReportImages,
  getReportImages,
  saveHistoryImages,
  getHistoryImages,
};