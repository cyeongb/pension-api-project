// config/db.js
const mariadb = require('mariadb');
const dotenv = require('dotenv');

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

// 데이터베이스 연결 테스트
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('데이터베이스 연결 성공');
    return true;
  } catch (err) {
    console.error('데이터베이스 연결 오류:', err);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  pool,
  testConnection
};