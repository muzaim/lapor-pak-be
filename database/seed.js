const db = require('../src/config/database');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await db.query('DELETE FROM reports');
    await db.query('DELETE FROM users');

    const [adminRes] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Pak Admin', 'admin@laporpak.com', adminPassword, 'ADMIN']
    );

    const [userRes] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Budi Pengadu', 'budi@example.com', userPassword, 'USER']
    );

    await db.query(
      `INSERT INTO reports (user_id, title, description, category, location, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userRes.insertId,
        'Lampu Jalan Mati',
        'Lampu jalan di depan RT 02 mati sejak dua hari yang lalu.',
        'INFRASTRUCTURE',
        'Jl. Mawar No. 12',
        'DIAJUKAN'
      ]
    );

    console.log('✅ Admin: admin@laporpak.com / admin123');
    console.log('✅ User: budi@example.com / user123');
    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();