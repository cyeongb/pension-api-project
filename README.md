# 국민연금 정보 조회 시스템

이 프로젝트는 국민연금공단 Open API를 활용하여 지역별, 연령별 국민연금 가입 및 수급 현황을 조회할 수 있는 웹 애플리케이션입니다.
---
[https://www.notion.so/cyeongb/1ceaa4605a0b8079a78ec0a027686b6b?pvs=4](https://www.notion.so/cyeongb/1ceaa4605a0b8079a78ec0a027686b6b?pvs=4)

## 기술 스택

### Backend
- Node.js
- Express.js (api 요청)
- MariaDB (지역 코드 관리)
- dotenv (환경 변수 관리)
- cors (CORS 정책 관리)
- axios (HTTP 요청)

### Frontend
- React.js
- React Router DOM (라우팅)
- Axios (HTTP 요청)
- Tailwind CSS (스타일링)


## API 엔드포인트
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


  ----
  <img width="674" alt="pjt3_1" src="https://github.com/user-attachments/assets/e502f30f-ca2d-42e9-a0f2-3cf5ebca2b1d" />

  ----

  <img width="505" alt="pjt3_2" src="https://github.com/user-attachments/assets/4b41452c-8329-444a-9f23-560b953405a1" />


