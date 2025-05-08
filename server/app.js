const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ path: '../.env' }); // .env 파일에서 환경 변수 로드
const app = express();

// CORS 옵션 설정
const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트의 주소를 명시
  credentials: true, // 자격 증명(쿠키 등)을 허용
  exposedHeaders: ["Authorization"],  // 클라이언트에서 'Authorization' 헤더를 읽을 수 있도록 설정
};

// CORS 설정
app.use(cors(corsOptions));

// cookie-parser 미들웨어 설정
app.use(cookieParser());

// 세션 설정 추가
app.use(session({
  secret: process.env.SESSION_SECRET, // 세션을 암호화하는 데 사용할 비밀 키
  resave: false,  // 세션이 수정되지 않아도 다시 저장할지 여부
  saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
  cookie: {
    httpOnly: true, // 클라이언트에서 JavaScript로 쿠키에 접근할 수 없도록 설정
    secure: false,  // 개발 환경에서는 false로 설정, 프로덕션에서는 true로 설정해야 하며 https를 사용해야 합니다
    maxAge: 24 * 60 * 60 * 1000, // 세션의 만료 시간 (24시간)
  }
}));

// // 네이버 로그인 요청 시 state 세션에 저장
// app.get("/login", (req, res) => {
//   const state = Math.random().toString(36).substring(2);  // 랜덤한 상태 값 생성
//   req.session.oauthState = state;  // 서버 세션에 상태 값 저장

//   // 네이버 로그인 URL로 리다이렉트
//   const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=9OCIuWKT3jDebHpNIKKN&response_type=code&redirect_uri=http://localhost:3000/naver-callback&state=${state}`;
//   res.redirect(naverLoginUrl);
// });

// // 네이버 로그인 후 콜백 처리
// app.get("/naver-callback", (req, res) => {
//   const stateFromUrl = req.query.state;  // 네이버에서 전달된 state 값
//   const stateFromSession = req.session.oauthState;  // 서버 세션에서 가져온 state 값

//   // state 값 비교 (CSRF 공격 방지)
//   if (stateFromUrl !== stateFromSession) {
//     return res.status(400).send("CSRF 공격 가능성 있음");
//   }

//   // 정상적인 로그인 처리
//   res.send("로그인 성공!");
// });

// JSON 파싱
app.use(express.json());
const userRoutes = require('./routes/userRoutes'); // 사용자 관련 라우트
const reservRoutes = require('./routes/reservRoutes'); // 예약 관련 라우트
const roomRoutes = require('./routes/roomRoutes'); // 객실 관련 라우트
const eventRoutes = require('./routes/eventRoutes'); // 이벤트 관련 라우트
const noticeRoutes = require('./routes/noticeRoutes'); // 공지사항 관련 라우트
const mainRoutes = require('./routes/mainRoutes'); // 메인페이지 관련 라우트


// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/reserv', reservRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/main', mainRoutes);

module.exports = app;
