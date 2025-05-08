const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// 전체 공지사항 조회 
router.get('/get-all-notices', noticeController.getAllNotices);
// 특정 공지사항(클릭한) 조회 
router.get('/get-notice-info/:noticeId', noticeController.getNoticeById);

module.exports = router;