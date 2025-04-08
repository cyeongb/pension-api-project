// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// 백엔드 서버와 통신하기 위한 API 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 지역별 국민연금 가입 현황 조회
export const getRegionSubscriptionInfo = async (address, age) => {
    console.log("지역별 api.js age=>",age);
    console.log("api.js address=>",address.legal_district_name);
  try {
    const response = await api.get('/region/subscription', {
      params: { address, age }
    });
    console.log("api.js response.data=>",response.data);
    return response.data;
  } catch (error) {
    console.error('지역별 가입 현황 조회 오류:', error);
    throw error;
  }
};

// 지역별 국민연금 수급 현황 조회
export const getRegionReceiptInfo = async (address, age) => {
  console.log("getRegionReceiptInfo()");
    console.log("api.js age=>",age);
    console.log("api.js address=>",address.legal_district_name);
  try {
    const response = await api.get('/region/receipt', {
      params: { address, age }
    });
    return response.data;
  } catch (error) {
    console.error('지역별 수급 현황 조회 오류:', error);
    throw error;
  }
};

// 연령별 국민연금 가입 현황 조회
export const getAgeSubscriptionInfo = async (age) => {
    console.log("연령별 가입api.js age=>",age);
  try {
    const response = await api.get('/age/subscription', {
      params: { age }
    });
    return response.data;
  } catch (error) {
    console.error('연령별 가입 현황 조회 오류:', error);
    throw error;
  }
};

// 연령별 국민연금 수급 현황 조회
export const getAgeReceiptInfo = async (age) => {
    console.log("api.js age=>",age);
    try {
        const response = await api.get('/age/receipt', {
            params: { age }
        });
        console.log("api.js response.data=>",response.data);
    return response.data;
  } catch (error) {
    console.error('연령별 수급 현황 조회 오류:', error);
    throw error;
  }
};

// 법정동 코드 검색
export const searchDistricts = async (name) => {
  console.log("법정동 코드 검색=> ",name);
  try {
    const response = await api.get('/districts/search', {
      params: { name }
    });
    return response.data;
  } catch (error) {
    console.error('법정동 코드 검색 오류:', error);
    throw error;
  }
};

// 모든 법정동 조회
export const getAllDistricts = async () => {
  try {
    const response = await api.get('/districts');
    return response.data;
  } catch (error) {
    console.error('법정동 목록 조회 오류:', error);
    throw error;
  }
};

export default {
  getRegionSubscriptionInfo,
  getRegionReceiptInfo,
  getAgeSubscriptionInfo,
  getAgeReceiptInfo,
  searchDistricts,
  getAllDistricts
};