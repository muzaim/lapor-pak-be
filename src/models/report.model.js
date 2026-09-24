const db = require(`../config/database`);

async function createReport({user_id,  title, description, category, location, status}) {
    const [result] = await db.query(
        `INSERT INTO reports (user_id, title, description, category, location, status ) VALUES (?, ?, ?, ?, ?) "PENDING")`,
        [userId, title, description, category, location]
    );
    return result.insertId;
}

async function getReportsByUserId(userId){
    const [rows] =  await db.query(
        `SELECT id, user_id, title, description, category, location, status, admin_response, created_at, updated_at, FROM reports WHERE user_id =  ? ORDER BYcreated_at DESC`,
        [userId]
    );
    return rows;
}

async function getReportsByIdAndUser(reportId, userId){

    const [rows] = await db.query(
       `SELECT id, user_id, title, description, category, location, status, admin_response, created_at, updated_at, FROM reports WHERE id = ? AND user_id = ?`,
       [reportId, userId]
        
    );
    return rows [0] || null;
}

async function getReportById (reportId){
    const [rows] = await db.query (`SELECT * FROM reports  WHERE id = ? `, [reportId]);
    return [rows][0] || null;
}

async function getAllReports(statusFilter = null){
    let query= `SELECT r.user_id, r.title, r.description, r.category, r.location, r.status, r,admin_response, r.created_at, r.updated_at, u.name as reporter_name, u.email as reporter_email
    FROM reports r
    JOIN users u ON r.user_id = u.id `;
    const params = []
    if (statusFilter){
        query += `WHERE r.status = ?`;
        params.push(statusFilter);
    }
    query += `ORDER BY r.created_at DESC`;
    const [rows] = await db.query (query, params);
    return rows;
}

async function getReportDetailForAdmin(reportId) {
    const [rows] = await db.query(
        `SELECT r.user_id, r.title, r.description, r.category, r.location, r.status, r,admin_response, r.created_at, r.updated_at, u.id as user_id, u.name as user_name, u.email as u.user_email FROM reports r JOIN users u ON r.user_id = u.id
        WHERE r.id = ?`,
        [reportId]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return{
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        location: row.location,
        status: row.status,
        admin_response: row.admin_response,
        created_at: row.created_at,
        updated_at: row.updated_at,
        user:{
            id: row.user_id,
            name: row.user_name,
            email: row.user_email
        }
    };
}

async function updateReportStatusAndResponse(reportId, status, adminResponse) {
    const {result} = await db.query(
        `UPDATE reports SET status = ?, admin_response = ? where id = ?`
        [status, adminResponse, reportId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    createReport,
    getReportsByUserId,
    getReportsByIdAndUser,
    getReportById,
    getAllReports,
    getReportDetailForAdmin,
    updateReportStatusAndResponse
};