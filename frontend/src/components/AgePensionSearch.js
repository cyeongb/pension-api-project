// src/components/AgePensionSearch.js
import React, { useState } from 'react';
import { getAgeSubscriptionInfo, getAgeReceiptInfo } from '../services/api';

const AgePensionSearch = () => {
  const [subscriptionAge, setSubscriptionAge] = useState('30');
  const [receiptAge, setReceiptAge] = useState('65');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [subscriptLoading, setSubscriptLoading] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);


  const [error, setError] = useState('');

  const handleSubscriptionSearch = async () => {
    if (!subscriptionAge) {
      setError('나이를 입력해주세요.');
      return;
    }
    
    if (subscriptionAge < 18 || subscriptionAge > 100) {
      setError('가입자 나이는 18세 이상 100세 이하로 입력해주세요.');
      return;
    }
    
    setSubscriptLoading(true);
    setError('');
    
    try {
      const data = await getAgeSubscriptionInfo(subscriptionAge);
      setSubscriptionData(data);
    } catch (error) {
      setError('가입 현황 정보 조회 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setSubscriptLoading(false);
    }
  };

  const handleReceiptSearch = async () => {
    if (!receiptAge) {
      setError('나이를 입력해주세요.');
      return;
    }
    
    if (receiptAge < 61 || receiptAge > 100) {
      setError('수급자 나이는 61세 이상 100세 이하로 입력해주세요.');
      return;
    }
    
    setReceiptLoading(true);
    setError('');
    
    try {
      const data = await getAgeReceiptInfo(receiptAge);
      setReceiptData(data);
    } catch (error) {
      setError('수급 현황 정보 조회 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setReceiptLoading(false);
    }
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
      <h2 className="text-2xl font-semibold mb-4">연령별 연금조회</h2>
      
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {/* 연령별 가입 현황 */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="text-xl font-medium mb-3">연령별 가입 현황 조회</h3>
        <div className="flex mb-4">
          <div className="w-full">
            <label className="block mb-2">나이 (18-100세)</label>
            <div className="flex">
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={subscriptionAge}
                onChange={(e) => setSubscriptionAge(e.target.value)}
                min="18"
                max="100"
              />
              <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubscriptionSearch}
                disabled={subscriptLoading}
              >
                {subscriptLoading ? '조회 중...' : '조회하기'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 결과 표시 영역 */}
        {subscriptionData && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">조회 결과</h4>
            <div className="border rounded p-4 bg-gray-50">
              <table className="w-full table-auto">
                <tbody>
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
                    <td className="py-2 font-medium">평균연금급여수준</td>
                    <td className="py-2">{(subscriptionData.avgAntcPnsAmt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* 연령별 수급 현황 */}
      <div className="p-4 border rounded">
        <h3 className="text-xl font-medium mb-3">연령별 수급 현황 조회</h3>
        <div className="flex mb-4">
          <div className="w-full">
            <label className="block mb-2">나이 (61-100세)</label>
            <div className="flex">
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={receiptAge}
                onChange={(e) => setReceiptAge(e.target.value)}
                min="61"
                max="100"
              />
              <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleReceiptSearch}
                disabled={receiptLoading}
              >
                {receiptLoading ? '조회 중...' : '조회하기'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 결과 표시 영역 */}
        {receiptData && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">조회 결과</h4>
            <div className="border rounded p-4 bg-gray-50">
              <table className="w-full table-auto">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균 연금액</td>
                    <td className="py-2">{(receiptData.avgFnlPrvsAmt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">평균 납부액대비 수급액 비율</td>
                    <td className="py-2">{receiptData.whlPymtCtstPrvsRate} %</td>
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

export default AgePensionSearch;