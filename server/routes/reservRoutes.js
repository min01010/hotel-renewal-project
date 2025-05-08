const express = require('express');
const router = express.Router();
const reservController = require('../controllers/reservController');

// 예약 바 - 예약가능 객실 검색
router.post('/get-available-rooms', reservController.getAvailableRooms);
// 예약 옵션 페이지 - 예약 생성(팝업에서 확인버튼 클릭 시)
router.post('/create-user-reservation', reservController.createUserReservation);
// 마이페이지 - 예약내역 조회, 삭제 
router.get('/get-user-reservations', reservController.getUserReservations);
router.post('/delete-user-reservation', reservController.deleteUserReservation);

module.exports = router;