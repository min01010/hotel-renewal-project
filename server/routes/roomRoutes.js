const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// 객실 페이지 - 정보 가져오기
router.get('/get-room-info/:roomId', roomController.getRoomById);
// 부가시설 페이지  - 정보 가져오기
router.get('/get-facility-info/:facilityId', roomController.getFacilityById);
// 메인페이지 - 전체 객실 소개 가져오기
router.get('/get-all-rooms', roomController.getAllRooms);
// 메인페이지 - 전체 부가시설 소개 가져오기
router.get('/get-all-facilities', roomController.getAllFacilities);

router.get("/get-room-types", roomController.getRoomTypes);
router.get("/get-facility-types", roomController.getFacilityTypes);


module.exports = router;