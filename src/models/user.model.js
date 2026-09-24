const db = require('../config/database')

async function finduserByEmail(email) {
    const [rows] = await db.query('SELECT * FROMusers WHERE email = ?,[email]');
}

async function findUserById(id){
    const[rows]= await db.query(
        'select id, name, email, role, created_at, updated_at, FROM users WHEREid = ?',[id]
    );
    return rows[0] || null;
}

async function CreateUser({name, email, password, role = 'user'}){
const [reuslt] = await db.query(
    'INSERT INTO users (name, email password, role)VALUES(?, ?, ?, ?)',
    [name, email, password, role]
)
    return result,imsertId;
}



module.exports = {
    finduserByEmail,
    findUserById,
    CreateUser
};

