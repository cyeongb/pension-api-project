// models/districtModel.js
const { pool } = require('../config/db');

// 법정동 이름으로 코드 찾기
async function findDistrictCodeByName(districtName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
      SELECT legal_district_code, legal_district_name 
      FROM district_code_table 
      WHERE legal_district_name LIKE ? AND is_abolished = 'Y'
    `;
    const rows = await conn.query(query, [`%${districtName}%`]);
    return rows;
  } catch (err) {
    console.error('법정동 코드 조회 오류:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// 법정동 코드로 이름 찾기
async function findDistrictNameByCode(districtCode) {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
      SELECT legal_district_name 
      FROM district_code_table 
      WHERE legal_district_code = ? AND is_abolished = 'Y'
    `;
    const rows = await conn.query(query, [districtCode]);
    return rows.length > 0 ? rows[0].legal_district_name : null;
  } catch (err) {
    console.error('법정동 이름 조회 오류:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// 모든 법정동 코드 목록 가져오기
async function getAllDistricts() {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
      SELECT legal_district_code, legal_district_name 
      FROM district_code_table 
      WHERE is_abolished = 'Y'
      ORDER BY legal_district_code
    `;
    const rows = await conn.query(query);
    return rows;
  } catch (err) {
    console.error('법정동 목록 조회 오류:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  findDistrictCodeByName,
  findDistrictNameByCode,
  getAllDistricts
};