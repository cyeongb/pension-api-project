// routes/api.js
const express = require('express');
const router = express.Router();
const pensionController = require('../controllers/pensionController');

// 지역별 가입 현황 정보 조회
router.get('/region/subscription', pensionController.getSbscrbSttusInfoSearch);

// 지역별 수급 현황 정보 조회
router.get('/region/receipt', pensionController.getReciptSttusInfoSearch);

// 연령별 가입 현황 정보 조회
router.get('/age/subscription', pensionController.getSbscrbAgeInfoSearch);

// 연령별 수급 현황 정보 조회
router.get('/age/receipt', pensionController.getReciptAgeInfoSearch);

// 법정동 코드 조회 API 추가
const districtModel = require('../models/districtModel');

router.get('/districts/search', async (req, res) => {
  try {
    const { name } = req.query;
    const districts = await districtModel.findDistrictCodeByName(name);
    res.json(districts);
  } catch (error) {
    console.error('법정동 코드 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.get('/districts', async (req, res) => {
  try {
    const districts = await districtModel.getAllDistricts();
    res.json(districts);
  } catch (error) {
    console.error('법정동 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;