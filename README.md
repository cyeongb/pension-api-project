# 국민연금 정보 조회 시스템

이 프로젝트는 국민연금공단 Open API를 활용하여 지역별, 연령별 국민연금 가입 및 수급 현황을 조회할 수 있는 웹 애플리케이션입니다.

## 기술 스택

### 백엔드
- Node.js
- Express.js
- MariaDB
- dotenv (환경 변수 관리)
- cors (CORS 정책 관리)
- axios (HTTP 요청)

### 프론트엔드
- React.js
- React Router DOM (라우팅)
- Axios (HTTP 요청)
- Tailwind CSS (스타일링)

## 설치 및 실행 방법

### 사전 요구사항
- Node.js 및 npm 설치
- MariaDB 설치
- 국민연금공단 Open API 서비스키 발급


## 사용 방법

1. 브라우저에서 http://localhost:3000 접속
2. 원하는 조회 방식 선택 (지역별 또는 연령별)
3. 필요한 정보 입력 후 조회 버튼 클릭
4. 결과 확인

## API 엔드포인트

### 백엔드 API

1. 지역별 가입 현황 조회: GET /api/region/subscription
   - 파라미터: address, age

2. 지역별 수급 현황 조회: GET /api/region/receipt
   - 파라미터: address, age

3. 연령별 가입 현황 조회: GET /api/age/subscription
   - 파라미터: age

4. 연령별 수급 현황 조회: GET /api/age/receipt
   - 파라미터: age

5. 법정동 코드 검색: GET /api/districts/search
   - 파라미터: name

6. 모든 법정동 목록 조회: GET /api/districts