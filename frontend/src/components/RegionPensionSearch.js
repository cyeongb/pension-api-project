// src/components/RegionPensionSearch.js
import React, { useState, useEffect ,useRef } from 'react';
import { getRegionSubscriptionInfo, getRegionReceiptInfo, searchDistricts } from '../services/api';

const RegionPensionSearch = () => {
  // const [address, setAddress] = useState('');
  const [subscriptAddress, setSubscriptAddress] = useState('');
  const [receiptAddress, setReceiptAddress] = useState('');


  const [subscriptionAge, setSubscriptionAge] = useState('30');
  const [receiptAge, setReceiptAge] = useState('65');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  
  // const [loading, setLoading] = useState(false);
  const [subscriptLoading, setSubscriptLoading] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  
  // const [suggestions, setSuggestions] = useState([]);
  const [scriptSuggestions, setScriptSuggestions] = useState([]);
  const [receiptSuggestions, setReceiptSuggestions] = useState([]);
  
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const [showScriptSuggestions, setShowScriptSuggestions] = useState(false);
  const [showReceiptSuggestions, setShowReceiptSuggestions] = useState(false);
  
  const [error, setError] = useState('');
  
  // 검색시 타임아웃 ref
  const timeoutRef = useRef(null);

  //지역별 가입현황 주소 검색
  useEffect(() => {
    if (subscriptAddress.length > 1) {
      const delaySearch = setTimeout(() => {
        fetchScriptAddressSuggestions(subscriptAddress);
      }, 500);
      return () => clearTimeout(delaySearch);
    }
     else {
      setScriptSuggestions([]);
      setShowScriptSuggestions(false);
    }
  },[subscriptAddress]);

  // 지역별 수급 현황 조회
  useEffect(() => {
    if(receiptAddress.length > 1){
      const delaySearch = setTimeout(() => {
        fetchReceiptAddressSuggestions(receiptAddress);
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
     else {
      setReceiptSuggestions([]);
      setShowReceiptSuggestions(false);
    }
  },[receiptAddress]);

  // const fetchAddressSuggestions = async (query) => {  
  //   try {
  //     const result = await searchDistricts(query);
  //     console.log("result ==>> ",result);
  //     if(subscriptAddress >1){
  //       setScriptSuggestions(result);
  //       setShowSuggestions(true);
  //     }else if(receiptAddress >1){
  //       setReceiptAddress(result);
  //       setShowSuggestions(true);
  //     }
  //   } catch (error) {
  //     console.error('주소 검색 오류:', error);
  //   }
  // };

  //가입현황 주소 suggestion
  const fetchScriptAddressSuggestions = async (query) => {  
    try {
      const result = await searchDistricts(query);
      console.log("Script address result ==>> ",result);
      setScriptSuggestions(result);
      setShowScriptSuggestions(true);
    } catch (error) {
      console.error('주소 검색 오류:', error);
      setScriptSuggestions([]); //하는이유.?
    }
  };

  // 수급현황 주소 suggestion
  const fetchReceiptAddressSuggestions = async (query) => {  
    try {
      const result = await searchDistricts(query);
      console.log("fetchReceiptAddressSuggestions  result ==>> ",result);
      setReceiptSuggestions(result);
      setShowReceiptSuggestions(true);
    } catch (error) {
      console.error('주소 검색 오류:', error);
      setReceiptSuggestions([]);
    }
  };

  //지역별 가입 검색
  const handleSubscriptionSearch = async () => {
    if (!subscriptAddress || !subscriptionAge) {
      setError('주소와 나이를 모두 입력해주세요.');
      return;
    }
    
    if (subscriptionAge < 18 || subscriptionAge > 100) {
      setError('가입자 나이는 만 18세 이상 75세 이하로 입력해주세요.');
      return;
    }
    
    setSubscriptLoading(true);
    setError('');

     // 이전 타임아웃이 있으면 제거
   if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  // 10초 타임아웃 설정
    timeoutRef.current = setTimeout(() => {
      console.log('타임아웃 동작');
      if (subscriptLoading) {
        setError('데이터를 조회할 수 없습니다. 데이터가 부족하거나 없습니다.');
        setSubscriptLoading(false);
      }else if(receiptLoading){
        setReceiptLoading(false);
      }
    }, 10000);
    
    try {
      const data = await getRegionSubscriptionInfo(subscriptAddress, subscriptionAge);
      console.log('RegionPensionSearch.js  API 응답:', data);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if(data){
        setSubscriptionData({
          jmgBrkdSgmmPrsnCnt: data.jnngBrkdSgmntPrsnCnt || '데이터 없음',
          rcgnAvgAmt: data.rcgnAvgAmt || '데이터 없음',
          rcgnAvgMcnt: data.rcgnAvgMcnt || '데이터 없음',
          avgAntcPnsAmt: data.avgAntcPnsAmt || '데이터 없음'
        });
        setError('');
      }
    } catch (error) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setError('가입 현황 정보 조회 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setSubscriptLoading(false);
    }
  };

  //지역별 수급 검색
  const handleReceiptSearch = async () => {
    console.log("handleReceiptSearch() 호출");
    if (!receiptAddress || !receiptAge) {
      setError('주소와 나이를 모두 입력해주세요.');
      return;
    }
    
    if (receiptAge < 61 || receiptAge > 90) {
      setError('수급자 나이는 61세 이상 90세 이하로 입력해주세요.');
      return;
    }
    
    setReceiptLoading(true);
    setError('');

       // 이전 타임아웃이 있으면 제거
   if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  // 10초 타임아웃 설정
    timeoutRef.current = setTimeout(() => {
      console.log('타임아웃 동작');
      if (subscriptLoading) {
        setError('데이터를 조회할 수 없습니다. 데이터가 부족하거나 없습니다.');
        setSubscriptLoading(false);
      }else if(receiptLoading){
        setReceiptLoading(false);
      }
    }, 10000);
    
    try {
      const data = await getRegionReceiptInfo(receiptAddress, receiptAge);
      console.log("getRegionReceiptInfo data =>",data);

      if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

    }
      if(data){
        setReceiptData(data);
        setError('');
      }
    } catch (error) {
      clearTimeout(timeoutRef);
      timeoutRef.current = null;
      setError('수급 현황 정보 조회 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setReceiptLoading(false);
    }
  };

  //지역별 가입 검색 주소
  const subscriptSuggestion = (suggestion) => {
    console.log("subscriptSuggestion() suggestion=> ",suggestion);
    setSubscriptAddress(suggestion.legal_district_name);
    setShowScriptSuggestions(false);
  };

  //지역별 수급 검색 주소
  const receiptSuggestion = (suggestion) => {
    console.log("receiptSuggestion() suggestion=> ",suggestion);
    setReceiptAddress(suggestion.legal_district_name);
    setShowReceiptSuggestions(false);
  };

   // 컴포넌트가 언마운트될 때 타임아웃 정리
   React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 4% 인상 금액 계산 함수
  const CalIncreasedPension = (money)=>{
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
        <div className="mb-4"></div>
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
            onFocus={() => subscriptAddress.length > 1 && setShowScriptSuggestions(true)}
            placeholder="예: 서울특별시 강남구 청운동"
          />
          
          {/* 주소 자동완성 */}
          {showScriptSuggestions && scriptSuggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
              {scriptSuggestions.map((suggestion, index) => (
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
            <label className="block mb-2">나이 (18-75세)</label>
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32"
          onClick={handleSubscriptionSearch}
          disabled={subscriptLoading}
        >
          {subscriptLoading ? '조회 중...' : '조회하기'}
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
                    <td className="py-2">{CalIncreasedPension(subscriptionData.rcgnAvgAmt)} 원</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균가입기간</td>
                    <td className="py-2">{subscriptionData.rcgnAvgMcnt} 개월</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균예상연금금액(월)</td>
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
            onFocus={() => receiptAddress.length > 1 && setShowReceiptSuggestions(true)}
            placeholder="예: 서울특별시 강남구 청운동"
          />
          
          {/* 주소 자동완성 */}
          { showReceiptSuggestions && receiptSuggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
              {receiptSuggestions.map((suggestion, index) => (
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
            <label className="block mb-2">나이 (61-90세)</label>
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32"
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