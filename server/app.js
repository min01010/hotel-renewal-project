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

// JSON 파싱
app.use(express.json());
const userRoutes = require('./routes/userRoutes'); // 사용자 관련 라우트
const reservRoutes = require('./routes/reservRoutes'); // 예약 관련 라우트
const roomRoutes = require('./routes/roomRoutes'); // 객실 관련 라우트
const eventRoutes = require('./routes/eventRoutes'); // 이벤트 관련 라우트
const noticeRoutes = require('./routes/noticeRoutes'); // 공지사항 관련 라우트
const mainRoutes = require('./routes/mainRoutes'); // 메인페이지 관련 라우트
const paymentRoutes = require('./routes/payment'); // 결제 관련 라우트


// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/reserv', reservRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/main', mainRoutes);
app.use("/api/payment", paymentRoutes);

module.exports = app;
