// src/components/RegionPensionSearch.js
import React, { useState, useEffect } from 'react';
import { getRegionSubscriptionInfo, getRegionReceiptInfo, searchDistricts } from '../services/api';

const RegionPensionSearch = () => {
  const [address, setAddress] = useState('');
  const [subscriptAddress, setSubscriptAddress] = useState('');
  const [receiptAddress, setReceiptAddress] = useState('');


  const [subscriptionAge, setSubscriptionAge] = useState('30');
  const [receiptAge, setReceiptAge] = useState('65');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (address.length > 1) {
      const delaySearch = setTimeout(() => {
        fetchAddressSuggestions(address);
      }, 500);
      
      return () => clearTimeout(delaySearch);
    } else {
      setSuggestions([]);
    }
  }, [address]);

  //지역별 가입현황 조회회
  useEffect(() => {
    if (subscriptAddress.length > 1) {
      const delaySearch = setTimeout(() => {
        fetchAddressSuggestions(subscriptAddress);
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
     else {
      setSuggestions([]);
    }
  },[subscriptAddress]);

  // 지역별 수급 현황 조회
  useEffect(() => {
    if(receiptAddress.length > 1){
      const delaySearch = setTimeout(() => {
        fetchAddressSuggestions(receiptAddress);
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
     else {
      setSuggestions([]);
    }
  },[receiptAddress]);

  const fetchAddressSuggestions = async (query) => {
    try {
      const result = await searchDistricts(query);
      console.log("result ==>> ",result);
      setSuggestions(result);
      setShowSuggestions(true);
    } catch (error) {
      console.error('주소 검색 오류:', error);
    }
  };

  const handleSubscriptionSearch = async () => {
    if (!subscriptAddress || !subscriptionAge) {
      setError('주소와 나이를 모두 입력해주세요.');
      return;
    }
    
    if (subscriptionAge < 18 || subscriptionAge > 100) {
      setError('가입자 나이는 만 18세 이상 100세 이하로 입력해주세요.');
      return;
    }
    
    setSubscriptionLoading(true);
    setError('');
    
    try {
      const data = await getRegionSubscriptionInfo(subscriptAddress, subscriptionAge);
      console.log('RegionPensionSearch.js  API 응답:', data);
      // setSubscriptionData(data);
      setSubscriptionData({
        jmgBrkdSgmmPrsnCnt: data.jnngBrkdSgmntPrsnCnt || '데이터 없음',
        rcgnAvgAmt: data.rcgnAvgAmt || '데이터 없음',
        rcgnAvgMcnt: data.rcgnAvgMcnt || '데이터 없음',
        avgAntcPnsAmt: data.avgAntcPnsAmt || '데이터 없음'
      });
    } catch (error) {
      setError('가입 현황 정보 조회 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // 중첩된 객체 경로에서 안전하게 값을 가져오는 헬퍼 함수
  // const getValueFromPath = (obj, path) => {
  //   return path.split('.').reduce((prev, curr) => {
  //     return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  //   }, obj);
  // };

  const handleReceiptSearch = async () => {
    if (!receiptAddress || !receiptAge) {
      setError('주소와 나이를 모두 입력해주세요.');
      return;
    }
    
    if (receiptAge < 61 || receiptAge > 100) {
      setError('수급자 나이는 61세 이상 100세 이하로 입력해주세요.');
      return;
    }
    
    setReceiptLoading(true);
    setError('');
    
    try {
      const data = await getRegionReceiptInfo(receiptAddress, receiptAge);
      console.log("getRegionReceiptInfo data =>",data);
      setReceiptData(data);
    } catch (error) {
      setError('수급 현황 정보 조회 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setReceiptLoading(false);
    }
  };

  // 여기도 각각 생성.?
  // const selectSuggestion = (suggestion) => {
  //   console.log("selectSuggestion()=> ",suggestion);
  //   setAddress(suggestion.legal_district_name);
  //   setShowSuggestions(false);
  // };

  const subscriptSuggestion = (suggestion) => {
    console.log("subscriptSuggestion()=> ",suggestion);
    setSubscriptAddress(suggestion.legal_district_name);
    setShowSuggestions(false);
  };

  const receiptSuggestion = (suggestion) => {
    console.log("receiptSuggestion()=> ",suggestion);
    setReceiptAddress(suggestion.legal_district_name);
    setShowSuggestions(false);
  };

  // 4% 인상 금액 계산 함수
  const CalPensionPay = (money)=>{
    if (!money) return "0";

    const numMoney = typeof money === 'string' ? parseFloat(money) : money;

    const increasedMoney = numMoney * 1.04;
    const roundedMoney = Math.round(increasedMoney); // 소수점 반올림하여 정수로 변환

    let localeMoney = roundedMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return localeMoney;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">지역별 연금 </h2>
      <hr />
      
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="mb-8 relative">
        <div className="mb-4">
          {/* <label className="block mb-2 font-medium">주소 입력</label> */}
          {/* <input
            type="text"
            className="w-full p-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => address.length > 1 && setShowSuggestions(true)}
            placeholder="예: 서울특별시 강남구 청운동"
          /> */}
          
          {/* 주소 자동완성 */}
          {/* {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion.legal_district_name}
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
      
      {/* 지역별 가입 현황 */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="text-xl font-medium mb-3">지역별 가입 현황 조회</h3>
        <div className="flex mb-4">
          <div className="w-3/4 pr-2">
            <label className="block mb-2">주소</label>
            <input
            type="text"
            className="w-full p-2 border rounded"
            value={subscriptAddress}
            onChange={(e) => setSubscriptAddress(e.target.value)}
            onFocus={() => subscriptAddress.length > 1 && setShowSuggestions(true)}
            placeholder="예: 서울특별시 강남구 청운동"
          />
          
          {/* 주소 자동완성 */}
          {subscriptAddress && showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => subscriptSuggestion(suggestion)}
                >
                  {suggestion.legal_district_name}
                </div>
              ))}
            </div>
          )}
          </div>
          <div className="w-1/4 pl-2">
            <label className="block mb-2">나이 (18-100세)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={subscriptionAge}
              onChange={(e) => setSubscriptionAge(e.target.value)}
              min="18"
              max="100"
            />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSubscriptionSearch}
          disabled={subscriptionLoading}
        >
          {subscriptionLoading ? '조회 중...' : '조회하기'}
        </button>
        
        {/* 결과 표시 영역 */}
        {subscriptionData && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">조회 결과</h4>
            <div className="border rounded p-4 bg-gray-50">
              <table className="w-full table-auto">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">가입자 수</td>
                    <td className="py-2">{subscriptionData.jmgBrkdSgmmPrsnCnt} 명</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균납부금액</td>
                    <td className="py-2">{(subscriptionData.rcgnAvgAmt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균납부금액(4%인상시)</td>
                    <td className="py-2">{CalPensionPay(subscriptionData.rcgnAvgAmt)} 원</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균가입기간</td>
                    <td className="py-2">{subscriptionData.rcgnAvgMcnt} 개월</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균예상연금금액</td>
                    <td className="py-2">{(subscriptionData.avgAntcPnsAmt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* 지역별 수급 현황 */}
      <div className="p-4 border rounded">
      <h3 className="text-xl font-medium mb-3">지역별 수급 현황 조회</h3>
        <div className="flex mb-4">
          <div className="w-3/4 pr-2">
            <label className="block mb-2">주소</label>
            <input
            type="text"
            className="w-full p-2 border rounded"
            value={receiptAddress}
            onChange={(e) => setReceiptAddress(e.target.value)}
            onFocus={() => receiptAddress.length > 1 && setShowSuggestions(true)}
            placeholder="예: 서울특별시 강남구 청운동"
          />
          
          {/* 주소 자동완성 */}
          { receiptAddress && showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => receiptSuggestion(suggestion)}
                >
                  {suggestion.legal_district_name}
                </div>
              ))}
            </div>
          )}
          </div>
          <div className="w-1/4 pl-2">
            <label className="block mb-2">나이 (61-100세)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={receiptAge}
              onChange={(e) => setReceiptAge(e.target.value)}
              min="61"
              max="100"
            />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleReceiptSearch}
          disabled={receiptLoading}
        >
          {receiptLoading ? '조회 중...' : '조회하기'}
        </button>
        
        {/* 결과 표시 영역 */}
        {receiptData && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">조회 결과</h4>
            <div className="border rounded p-4 bg-gray-50">
              <table className="w-full table-auto">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">수급대상 인원 수</td>
                    <td className="py-2">{receiptData.totPrsnCnt} 명</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균 연금수급액(월)</td>
                    <td className="py-2">{(receiptData.avgFnlPrvsAmt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균납부액대비 수급액 비율</td>
                    <td className="py-2">{receiptData.whlPymtCtstPrvsRate}%</td>
                  </tr> 
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionPensionSearch;