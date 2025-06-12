const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// 이벤트 페이지 - 전체 이벤트 조회 
router.get('/get-all-events', eventController.getAllEvents);
// 이벤트 상세 페이지 - 해당 이벤트 내용 조회 
router.get('/get-event-info/:eventId', eventController.getEventById);

module.exports = router;