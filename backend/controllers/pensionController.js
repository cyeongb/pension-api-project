// controllers/pensionController.js
const axios = require('axios');
const districtModel = require('../models/districtModel');

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });

// 국민연금 API 기본 URL
const NPS_API_BASE_URL = process.env.NPS_API_BASE_URL;
const SERVICE_KEY = process.env.SERVICE_KEY;

// '4q7O0DXZgc%2FEyIzftHY22RlnOOikH4jaHhwtrZORejvfFiTiCwzuwQF3JlMHkEDGAc25Jyq%2Fg%2BdP9Zpx2dIc8w%3D%3D';
// 지역별 가입 현황 정보 조회
exports.getSbscrbSttusInfoSearch = async (req, res) => {
  try {
    const { address, age } = req.query;

    // 주소로 법정동 코드 조회
    const districts = await districtModel.findDistrictCodeByName(address);

    if (districts.length === 0) {
      return res.status(404).json({ message: '해당 지역을 찾을 수 없습니다.' });
    }
    
    // 첫 번째 결과 사용
    const districtCode = districts[0].legal_district_code;
    
    // 법정동 코드에서 필요한 부분 추출
    const dgCd = districtCode.substring(0, 2);
    const sgguCd = districtCode.substring(0, 5);
    const sgguEmdCd = districtCode.substring(0, 8);
    
    // 국민연금 API 요청 파라미터
    // const params = {
    //   ServiceKey: SERVICE_KEY,
    //   ldong_addr_mgpl_dg_cd: dgCd,
    //   ldong_addr_mgpl_sggu_cd: sgguCd,
    //   ldong_addr_mgpl_sggu_emd_cd: sgguEmdCd,
    //   jnngp_age: age
    // };

    // API 요청
    const baseUrl = `${NPS_API_BASE_URL}/NpsSbscrbInfoProvdService/getSbscrbSttusInfoSearch`;
    
    // 직접 URL에 모든 파라미터를 포함하는 방식
    const fullUrl = `${baseUrl}?ldong_addr_mgpl_dg_cd=${dgCd}&ldong_addr_mgpl_sggu_cd=${sgguCd}&ldong_addr_mgpl_sggu_emd_cd=${sgguEmdCd}&jnngp_age=${age}&ServiceKey=${SERVICE_KEY}`;
    console.log("지역별 가입 현황 fullUrl =>",fullUrl);

    const response = await axios.get(fullUrl, {
      responseType: 'json' 
    });
      console.log("response 상태=>",response.status);
      
      const responseData = response.data;
    
      // 응답 확인 및 처리
      if (responseData && responseData.response) {
        const { header, body } = responseData.response;
        
        // 오류 확인
        if (header && header.resultCode !== '00') {
          return res.status(400).json({
            error: header.resultMsg || '오류가 발생했습니다.',
            code: header.resultCode
          });
        }
        
        // 성공 응답 처리
        if (body && body.item) {
          // 필요한 데이터 추출
          const result = {
            avgAntcPnsAmt: body.item.avgAntcPnsAmt || '데이터 없음',  // 평균예상연금금액
            jnngBrkdSgmntPrsnCnt: body.item.jnngBrkdSgmntPrsnCnt || '데이터 없음',  //가입내역구간인원수(해당 지역 피보험자 수)
            rcgnAvgAmt: body.item.rcgnAvgAmt || '데이터 없음',  //평균납부금액
            rcgnAvgMcnt: body.item.rcgnAvgMcnt || '데이터 없음'  //평균가입기간
          };
          
          return res.json(result);
        } 
      } 
      else {
        // 응답 구조가 예상과 다른 경우
        console.error('응답 구조가 예상과 다릅니다:', responseData);
        return res.status(500).json({ message: '응답 형식이 올바르지 않습니다.', data: responseData });
      }
      
    } catch (error) {
      console.error('지역별 가입 현황 정보 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  };

// 지역별 수급 현황 정보 조회
exports.getReciptSttusInfoSearch = async (req, res) => {
  try {
    const { address, age } = req.query;
    
    // 주소로 법정동 코드 조회
    const districts = await districtModel.findDistrictCodeByName(address);
    
    if (districts.length === 0) {
      return res.status(404).json({ message: '해당 지역을 찾을 수 없습니다.' });
    }
    
    // 첫 번째 결과 사용
    const districtCode = districts[0].legal_district_code;
    
    // 법정동 코드에서 필요한 부분 추출
    const dgCd = districtCode.substring(0, 2);
    const sgguCd = districtCode.substring(0, 5);
    const sgguEmdCd = districtCode.substring(0, 8);
    
    // API 요청
    const baseUrl = `${NPS_API_BASE_URL}/NpsReciptInfoProvdService/getReciptSttusInfoSearch`;
        
    // 직접 URL에 모든 파라미터를 포함하는 방식
    const fullUrl = `${baseUrl}?ldong_addr_mgpl_dg_cd=${dgCd}&ldong_addr_mgpl_sggu_cd=${sgguCd}&ldong_addr_mgpl_sggu_emd_cd=${sgguEmdCd}&crtr_age=${age}&ServiceKey=${SERVICE_KEY}`;
    console.log("지역별 수급 현황 fullUrl =>",fullUrl);
 

    const response = await axios.get(fullUrl, {
      responseType: 'json' 
    });
      console.log("response 상태=>",response.status);
      
      const responseData = response.data;
    
      // 응답 확인 및 처리
      if (responseData && responseData.response) {
        const { header, body } = responseData.response;
        
        // 오류 확인
        if (header && header.resultCode !== '00') {
          return res.status(400).json({
            error: header.resultMsg || '오류가 발생했습니다.',
            code: header.resultCode
          });
        }
        
        // 성공 응답 처리
        if (body && body.item) {
          // 필요한 데이터 추출
          const result = {
            totPrsnCnt: body.item.totPrsnCnt || '데이터 없음',  //수급대상 인원 수
            avgFnlPrvsAmt: body.item.avgFnlPrvsAmt || '데이터 없음',  //평균 연금수급액(월)
            whlPymtCtstPrvsRate: body.item.whlPymtCtstPrvsRate || '데이터 없음',  //평균납부액대비 수급액 비율
            avgTotPrvsAmt: body.item.avgTotPrvsAmt || '데이터 없음'  //평균  누적연금수급액
          };
          console.log("수급자 result=>>",result);
          return res.json(result);
        } 
        else {
          // body가 비어있거나 data 항목이 없는 경우
          return res.status(404).json({ message: '데이터가 없습니다.1' });
        }
      } else {
        // 응답 구조가 예상과 다른 경우
        console.error('응답 구조가 예상과 다릅니다:', responseData);
        return res.status(500).json({ message: '응답 형식이 올바르지 않습니다.', data: responseData });
      }
    } catch (error) {
      console.error('지역별 수급 현황 정보 조회 오류:', error);
      console.log(error.message);
      res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  };

// 연령별 가입 현황 정보 조회
exports.getSbscrbAgeInfoSearch = async (req, res) => {
  try {
    const { age } = req.query;
    
    // 국민연금 API 요청 파라미터 설정
    const params = {
      ServiceKey: SERVICE_KEY,
      jnngp_age: age
    };
    
    // API 요청
    const baseUrl = `${NPS_API_BASE_URL}/NpsSbscrbInfoProvdService/getSbscrbAgeInfoSearch`;
    const fullUrl = `${baseUrl}?jnngp_age=${age}&ServiceKey=${SERVICE_KEY}`;
    console.log("연령별 가입 현황 fullUrl =>",fullUrl);

    const response = await axios.get(fullUrl, {
      responseType: 'json' 
    });
  
    console.log("pension 컨트롤러 response 상태=>",response.status);
  
  const responseData = response.data;

  // 응답 확인 및 처리
  if (responseData && responseData.response) {
    const { header, body } = responseData.response;
    
    // 오류 확인
    if (header && header.resultCode !== '00') {
      return res.status(400).json({
        error: header.resultMsg || '오류가 발생했습니다.',
        code: header.resultCode
      });
    }
    
    // 성공 응답 처리
    if (body && body.item) {
      // 필요한 데이터 추출
      const result = {
        rcgnAvgAmt: body.item.rcgnAvgAmt || '데이터 없음',
        rcgnAvgMcnt: body.item.rcgnAvgMcnt || '데이터 없음',
        avgAntcPnsAmt: body.item.avgAntcPnsAmt || '데이터 없음',
      };
      
      return res.json(result);
    } 
    else {
      // body가 비어있거나 data 항목이 없는 경우
      return res.status(404).json({ message: '데이터가 없습니다.' });
    }
  } else {
    // 응답 구조가 예상과 다른 경우
    console.error('응답 구조가 예상과 다릅니다:', responseData);
    return res.status(500).json({ message: '응답 형식이 올바르지 않습니다.', data: responseData });
  }
  
} catch (error) {
  console.error('지역별 가입 현황 정보 조회 오류:', error);
  res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
}
};

// 연령별 수급 현황 정보 조회
exports.getReciptAgeInfoSearch = async (req, res) => {
  try {
    const { age } = req.query;
    
    // 국민연금 API 요청 파라미터 설정
    const params = {
      ServiceKey: SERVICE_KEY,
      crtr_age: age   //기준연령
    };
    
    // API 요청
    const baseUrl = `${NPS_API_BASE_URL}/NpsReciptInfoProvdService/getReciptAgeInfoSearch`;
    const fullUrl = `${baseUrl}?crtr_age=${age}&ServiceKey=${SERVICE_KEY}`;
    console.log("연령별 수급 현황 fullUrl =>",fullUrl);

    const response = await axios.get(fullUrl, {
      responseType: 'json' 
    });
      console.log("pension 컨트롤러 response 상태=>",response.status);
      
      const responseData = response.data;
    
      // 응답 확인 및 처리
      if (responseData && responseData.response) {
        const { header, body } = responseData.response;
        
        // 오류 확인
        if (header && header.resultCode !== '00') {
          return res.status(400).json({
            error: header.resultMsg || '오류가 발생했습니다.',
            code: header.resultCode
          });
        }
        
        // 성공 응답 처리
        if (body && body.item) {
          // 필요한 데이터 추출
          const result = {
            avgFnlPrvsAmt: body.item.avgFnlPrvsAmt || '데이터 없음',  //평균연금액
            //avgPrvsPrdMcnt: body.item.avgPrvsPrdMcnt || '데이터 없음',  //평균수급기간
            whlPymtCtstPrvsRate: body.item.whlPymtCtstPrvsRate || '데이터 없음',  //납부한 금액에 비례한 수급액 비율율
          };
          
          return res.json(result);
        } 
        else {
          // body가 비어있거나 data 항목이 없는 경우
          return res.status(404).json({ message: '데이터가 없습니다.' });
        }
      } else {
        // 응답 구조가 예상과 다른 경우
        console.error('응답 구조가 예상과 다릅니다:', responseData);
        return res.status(500).json({ message: '응답 형식이 올바르지 않습니다.', data: responseData });
      }
      
    } catch (error) {
      console.error('지역별 가입 현황 정보 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  };