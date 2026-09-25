const db = require("../config/database");

async function findUserByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await db.query(
    "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function createUser({ name, email, password, role = "USER" }) {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return result.insertId;
}

async function getAllUsers({ page = 1, limit = 10 } = {}) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const offset = (pageNum - 1) * limitNum;

  const [countRows] = await db.query("SELECT COUNT(*) as total FROM users");
  const totalItems = countRows[0].total;

  const [rows] = await db.query(
    "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [limitNum, offset]
  );

  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  return {
    users: rows,
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

async function updateUser(id, { name, email, password, role }) {
  const current = await findUserById(id);
  if (!current) return null;

  const updatedName = name !== undefined ? name : current.name;
  const updatedEmail = email !== undefined ? email : current.email;
  const updatedRole = role !== undefined ? role : current.role;

  let query = "UPDATE users SET name = ?, email = ?, role = ?";
  const params = [updatedName, updatedEmail, updatedRole];

  if (password) {
    query += ", password = ?";
    params.push(password);
  }

  query += " WHERE id = ?";
  params.push(id);

  await db.query(query, params);
  return await findUserById(id);
}

async function deleteUser(id) {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function findUserByIdWithPassword(id) {
  const [rows] = await db.query(
    "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function updatePassword(id, hashedPassword) {
  const [result] = await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  createUser,
  getAllUsers,
  updateUser,
  updatePassword,
  deleteUser,
};
