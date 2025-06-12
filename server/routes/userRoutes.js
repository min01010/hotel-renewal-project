const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
  
// 회원가입 라우트
router.post('/signup', userController.signup);

// 아이디 중복 체크
router.get('/check-id', userController.checkId);

// 로그인 라우트
router.post('/login', userController.login);

// 로그아웃 라우트
router.post('/logout', userController.logout);

// 네이버 로그인
router.post('/naver-login', userController.naverLogin);

// 카카오 로그인
router.post('/kakao-login', userController.kakaoLogin);

// 엑세스 토큰 갱신 라우터
router.post('/refresh-token', userController.refreshToken);

// 리프레시 토큰 검증 후 만료 시 로그아웃 라우터 (로컬 로그인)
router.post('/validate-refresh-token', userController.validateRefreshToken);

// 리프레시 토큰 유효성 검사 및 새 엑세스 토큰 발급 라우터 (네이버)
router.post('/refresh-naver-token', userController.refreshNaverToken);

// 리프레시 토큰 유효성 검사 및 새 엑세스 토큰 발급 라우터 (카카오)
router.post('/refresh-kakao-token', userController.refreshKakaoToken);

// 통합 요청 수락 API
router.post("/accept-integration", userController.acceptIntegration);

// SNS 로그인 요청 시 서버 세션에 state 저장
router.post("/set-auth-state", userController.setAuthState);

// 이용약관 조회
router.get('/get-terms', userController.getTerms);
// 예약옵션 페이지 - 사용자 정보 조회
router.get('/get-reserv-user-info', userController.getReservUserInfo);

// 사용자가 동의한 약관 전송
router.post("/agree-terms", userController.agreeTerms);

// 마이페이지- 비밀번호 변경
router.post("/update-user-password", userController.updateUserPassword);

//객실페이지 - 하트확인
router.get("/check-if-liked", userController.checkIfLiked);

// 마이페이지 - 위시리스트
router.get("/get-user-wishlist", userController.getUserWishlist);
router.post("/create-user-wishlist", userController.createUserWishlist);
router.post("/delete-user-wishlist", userController.deleteUserWishlist);

//마이페이지 - 회원정보 수정
router.get('/get-user-info', userController.getUserInfo);
router.post("/update-user-info", userController.updateUserInfo);

//회원탈퇴
router.post("/withdraw", userController.withdraw);

module.exports = router;
