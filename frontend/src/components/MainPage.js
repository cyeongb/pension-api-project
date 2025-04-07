// src/components/MainPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegionPensionSearch from './RegionPensionSearch';
import AgePensionSearch from './AgePensionSearch';

// 메인 페이지 - 지역별 연금조회와 연령별 연금조회 화면을 포함
const MainPage = () => {
  const [activeTab, setActiveTab] = useState('region'); // 'region' 또는 'age'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">국민연금 정보 조회 시스템</h1>
      <div className="text-lg font-bold mb-6 text-center">내가 내는 돈은 내가 알아야 한다..!</div>
      
      {/* 탭 메뉴 */}
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 w-1/2 text-center font-medium ${
            activeTab === 'region' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('region')}
        >
          지역별 연금조회
        </button>
        <button
          className={`px-4 py-2 w-1/2 text-center font-medium ${
            activeTab === 'age' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('age')}
        >
          연령별 연금조회
        </button>
      </div>

      {/* 선택된 탭에 따라 컴포넌트 렌더링 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === 'region' ? (
          <RegionPensionSearch />
        ) : (
          <AgePensionSearch />
        )}
      </div>
    </div>
  );
};

export default MainPage;