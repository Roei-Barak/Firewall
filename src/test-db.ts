import pool from './db.js';

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Server time:', res.rows[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await pool.end();
  }
};

testConnection();